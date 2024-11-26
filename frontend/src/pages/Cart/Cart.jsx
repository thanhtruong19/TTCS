import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isFreeShip, setIsFreeShip] = useState(false);

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  const applyPromoCode = () => {
    const maGiamGia = promoCode.toUpperCase();
    if (maGiamGia === 'GIAM10%') {
      setDiscount(0.1); // Giảm giá 10%
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
    } else {
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

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Món ăn</p> <p>Tên món</p> <p>Giá</p> <p>Số lượng</p> <p>Thành tiền</p> <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price}K</p>
                  <div>{cartItems[item._id]}</div>
                  <p>{item.price * cartItems[item._id]}K</p>
                  <p className='cart-items-remove-icon' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng </h2>
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
            <div className="cart-total-details"><b>Tổng cộng</b><b>{finalAmount}K</b></div>
          </div>
          <button onClick={() => navigate('/order')}>TIẾN HÀNH THANH TOÁN</button>
        </div>
        
      </div>
    </div>
  );
};

export default Cart;
