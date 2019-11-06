import React, {Component} from 'react'

import './orderList.css'

class orderList extends Component{
  render() {
    return (
      <div>
       <ul className="orders__list">
         {this.props.orders.map(order => {
           return (
             <li className="orders__item" key={order._id}>
                <div className="orders__list-data">
                  {order.product.title} - {' '}
                  {new Date(order.createdAt).toLocaleDateString()} - {' '}
                  ${order.product.price}
                  {console.log(order)}
                </div>
               <div className="orsers__item-actions">
                 <button className="btn" onClick={this.props.onDelete.bind(this, order._id)}>Cancel</button>
               </div>
           </li>
          )
         })}
       </ul>
    </div>
    )
  }
}

export default orderList;
