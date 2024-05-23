import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>Chuỗi nhà hàng đã mở hơn 200 chi nhánh trên toàn thế giới và chúng tôi đang có mục tiêu đem đến trải nghiệm ăn uống tốt nhất cho quý khách!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Công ty</h2>
            <ul>
                <li>Trang chủ</li>
                <li>Về chúng tôi</li>
                <li>Giao hàng</li>
                <li>Chính sách bảo mật</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Liên lạc</h2>
            <ul>
                <li>0392875396</li>
                <li>TuanThanh'sFoodStore@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © TuanThanhFoodStore.com - Mọi quyền được bảo vệ.</p>
    </div>
  )
}

export default Footer
