import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isFreeShip, setIsFreeShip] = useState(false);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const handlePromoCodeChange = (event) => {
        setPromoCode(event.target.value);
    };

    const applyPromoCode = () => {
        const maGiamGia = promoCode.toUpperCase();
        let sumItem = 0;
        food_list.forEach((item) => {
            sumItem += (cartItems[item._id] || 0);
        });

        if (maGiamGia === 'GIAM15%') {
            setDiscount(0.15); // Giảm giá 15%
            setIsFreeShip(false);
        } else if (maGiamGia === 'GIAM20%') {
            setDiscount(0.2); // Giảm giá 20%
            setIsFreeShip(false);
        } else if (maGiamGia === 'GIAM50%') {
            setDiscount(0.5); // Giảm giá 50%
            setIsFreeShip(false);
        } else if (maGiamGia === 'FREESHIP') {
            setDiscount(0); // Không giảm giá trên sản phẩm
            setIsFreeShip(true); // Áp dụng mã FreeShip
        } else if (maGiamGia === 'GIAM15%') {
            if (sumItem >= 5) {
                setDiscount(0.15); // Giảm giá 15%
                setIsFreeShip(false);
            } else {
                setDiscount(0);
                setIsFreeShip(false);
                alert('Bạn chưa đủ điều kiện sử dụng mã giảm giá này. Hãy mua đủ 5 sản phẩm để sử dụng mã giảm giá.');
            }
        }else if(maGiamGia === "GIAM10%"){
            if(getTotalCartAmount() > 100){
            setDiscount(0.1);
            setIsFreeShip(false);
            alert('Bạn được giảm giá vì mua trên 100k');
        }
        }else {
            setDiscount(0); // Không có giảm giá
            setIsFreeShip(false); // Không áp dụng mã FreeShip
            alert('Mã giảm giá không hợp lệ');
        }
    };

    const totalAmount = getTotalCartAmount();
    const discountedAmount = totalAmount * (1 - discount);
    const shippingCost = totalAmount === 0 ? 0 : 10;
    const finalAmount = discountedAmount + (isFreeShip ? 0 : shippingCost);
    const discountMessage = isFreeShip ? 'Áp dụng mã giảm giá Freeship' : `Tổng tiền giảm giá (Áp dụng mã giảm ${discount * 100}%)`;

    useEffect(() => {
        if (!token) {
            toast.error("Để đặt hàng, vui lòng đăng nhập trước");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, navigate, getTotalCartAmount]);

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);  
            }
            return null;
        });
        let orderData = {
            address: data,
            items: orderItems,
            amount: finalAmount,
        };
        let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
        if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
        } else {
            toast.error("Đặt hàng thành công!");
            navigate('/myorders');
        }
    };

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Thông tin vận chuyển</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='Họ' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Tên' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Địa chỉ Email' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Khu phố' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='Thành phố' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='Huyện' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Số nhà' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Quốc gia' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Số điện thoại' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Tổng cộng giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details"><p>Tổng tiền món ăn</p><p>{totalAmount}K</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Chi phí vận chuyển</p><p>{shippingCost}K</p></div>
                        <hr />
                        <div className="cart-total-details">
                            <p>{discount === 0 && !isFreeShip ? 'Tổng tiền giảm giá' : discountMessage}</p>
                            <p>-{isFreeShip ? 10 : (totalAmount * discount)}K</p>
                        </div>
                        <hr />
                        <div className="cart-total-details"><b>Thành tiền</b><b>{finalAmount}K</b></div>
                    </div>
                </div>
                <div className='cart-promocode'>
                    <p>Mã giảm giá:</p>
                    <div className='cart-promocode-input'>
                        <input type="text" placeholder='Mã giảm giá' value={promoCode} onChange={handlePromoCodeChange} />
                        <button type='button' onClick={applyPromoCode}>Nhập mã</button>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>TIẾN HÀNH THANH TOÁN</button>
            </div>
        </form>
    );
}

export default PlaceOrder;
