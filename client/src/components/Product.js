import Card from 'react-bootstrap/Card';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardImage,
  MDBCardGroup,
} from "mdb-react-ui-kit";
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../stores/Store';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const excerpt = (str) => {
    if (str.length > 20) {
      str = str.substring(0, 20) + " ...";
    }
    return str;
  };

  return (
    // <>
    //   <Card>
    //     <Link to={`/product/${product.title}`}>
    //       <img src={product.image} className="card-img-top" alt={product.title} />
    //     </Link>
    //     <Card.Body>
    //       <Card.Title>{product.title}</Card.Title>
    //       <Card.Text>Author: {product.author}</Card.Text>
    //       <Card.Text>Category: #{product.category}</Card.Text>
    //       <Rating rating={product.rating} numReviews={product.numReviews} />
    //       <Card.Text>{product.price} VND</Card.Text>
    //       <Card.Text>
    //         Description: {excerpt(product.description)}
    //         <Link to={`/product/${product.title}`} style={{marginLeft: "8px"}}>Read More</Link>
    //       </Card.Text>
    //       {product.countInStock === 0 ? (
    //         <Button variant="light" disabled>
    //           Out of stock
    //         </Button>
    //       ) : (
    //         <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
    //       )}
    //     </Card.Body>
    //   </Card>

    
    // </>
    <MDBCardGroup>
      <MDBCard className="h-100 mt-2 d-sm-flex" style={{width: "970px"}}>
        <MDBCardImage
          src={product.image}
          alt={product.title}
          position="top"
          style={{ width: "304px", height: "170px" }}
        />
        <MDBCardBody>
          <MDBCardTitle className="text-start">{product.title}</MDBCardTitle>
          <MDBCardSubTitle className="text-start" style={{color: "#F96666"}}>Author: {product.author}</MDBCardSubTitle>
          <MDBCardText className="text-start">
            <Card.Text>Category: #{product.category}</Card.Text>
          </MDBCardText>
          <MDBCardText className="text-start">
          <Card.Text>Price: {product.price} VND</Card.Text>
          </MDBCardText>
          <Rating rating={product.rating} numReviews={product.numReviews} />

          <MDBCardText className="text-start">
            {excerpt(product.description)}
            <Link to={`/product/${product._id}`} style={{marginLeft: "8px"}}>Read More</Link>
          </MDBCardText>
          {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
        </MDBCardBody>
      </MDBCard>
    </MDBCardGroup>
  );
}
export default Product;
