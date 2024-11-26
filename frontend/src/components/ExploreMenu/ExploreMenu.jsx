import React, { useContext } from 'react'
import './ExploreMenu.css'
import { StoreContext } from '../../Context/StoreContext'

const ExploreMenu = ({category,setCategory}) => {

  const {menu_list} = useContext(StoreContext);
  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Khám phá Menu của chúng tôi</h1>
      <p className='explore-menu-text'>Món ăn ở đây được tuyển chọn một cách cầu kì trước khi được đưa vào thực đơn, nhà hàng cam kết sẽ nâng trải nghiệm ăn uống của thực khách lên một tầm cao mới</p>
      <div className="explore-menu-list">
        {menu_list.map((item,index)=>{
            return (
              //prev là giá trị category hiện tại
                <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'> 
                    <img src={item.menu_image} className={category===item.menu_name?"active":""} alt="" />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
