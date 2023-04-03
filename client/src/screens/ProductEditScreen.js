import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../stores/Store';
import { getError } from '../utils/utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
  MDBCard,
  MDBCardBody,
  MDBValidation,
  MDBBtn,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";
import ChipInput from "material-ui-chip-input";
import moment from "moment";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublicDate] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState([]);
  const [countInStock, setCountInStock] = useState('');
  const [pageCount, setPageCount] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setTitle(data.title);
        setAuthor(data.author);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setPublicDate(data.publishDate);
        setDescription(data.description);
        setPageCount(data.pageCount);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          title,
          author,
          price,
          image,
          images,
          category,
          publishDate,
          countInStock,
          description,
          pageCount,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (filetitle, f) => {
    console.log(filetitle, f);
    console.log(images);
    console.log(images.filter((x) => x !== filetitle));
    setImages(images.filter((x) => x !== filetitle));
    toast.success('Image removed successfully. click Update to apply it');
  };

  const options = [
    { value: 'Adventure stories', label: 'Adventure stories' },
    { value: 'Classics', label: 'Classics' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Fairy tales, fables, and folk tales', label: 'Fairy tales, fables, and folk tales' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Historical fiction', label: 'Historical fiction' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Humour and satire', label: 'Humour and satire' },
  ];

  return (
    <Container classtitle="small-container">
      <h1>Edit Product</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "1000px",
            alignContent: "center",
            marginTop: "50px",
          }}
          className="container"
        >
        <MDBCard alignment="center">
          <MDBCardBody>
            <MDBValidation onSubmit={submitHandler} className="row g-3" noValidate>
            <MDBRow className="g-0 mt-4">

              <MDBRow className="g-0">
                <MDBCol md="6">
                  <MDBRow className="g-0">
                    <MDBCol md="5">
                      <div className="col-md-12">
                        <Form.Group classtitle="mb-3" controlId="title">
                          <Form.Label>Title</Form.Label>
                            <Form.Control
                              value={title || ""}
                              onChange={(e) => setTitle(e.target.value)}
                              required
                              type='text'
                            />
                          </Form.Group>
                      </div>
                    </MDBCol>

                    <MDBCol md="2"></MDBCol>

                    <MDBCol md="5">
                      <div className="col-md-12">
                        <Form.Group classtitle="mb-3" controlId="title">
                          <Form.Label>Author</Form.Label>
                            <Form.Control
                              value={author || ""}
                              onChange={(e) => setAuthor(e.target.value)}
                              required
                              type='text'
                            />
                          </Form.Group>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>

                <MDBCol md="1"></MDBCol>

                <MDBCol md="5">
                  <div className="flex justify-content-center">
                    <Form.Group classtitle="mb-3" controlId="imageFile">
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control type="file" onChange={uploadFileHandler} />
                    </Form.Group>
                  </div>
                </MDBCol>
              </MDBRow>

              <MDBRow className="g-0 mt-3">
                <MDBCol md="6">
                  <MDBRow className="g-0">
                    <Form.Group classtitle="mb-3" controlId="title">
                      <Form.Label>Description</Form.Label>
                        <Form.Control
                          value={description || ""}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          type='text'
                        />
                    </Form.Group>
                  </MDBRow>

                  <MDBRow className="g-0 mt-5">
                    <MDBCol md="5">
                      <div className="col-md-12">
                          <Form.Group classtitle="mb-3" controlId="title">
                            <Form.Label>Public Date</Form.Label>
                              <Form.Control
                                value={publishDate == null ? "" : moment(publishDate).format('YYYY-MM-DD')}
                                onChange={(e) => setPublicDate(e.target.value)}
                                required
                                type='date'
                              />
                            </Form.Group>
                      </div>
                    </MDBCol>

                    <MDBCol md="2"></MDBCol>

                    <MDBCol md="5">
                      <div className="col-md-12">
                          <Form.Group classtitle="mb-3" controlId="title">
                            <Form.Label>Page Count</Form.Label>
                              <Form.Control
                                value={pageCount || ""}
                                onChange={(e) => setPageCount(e.target.value)}
                                required
                                type='text'
                              />
                            </Form.Group>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>

                <MDBCol md="1"></MDBCol>

                <MDBCol md="5">
                  <div className='mt-4' style={{border: "dotted", height: "200px", minWidth: "70%"}}>
                    <MDBCardImage
                      src={image}
                      alt={title}
                      position="top"
                      style={{ maxWidth: "50%", height: "140px" }}
                      className="mt-4"
                    />
                  </div>
                </MDBCol>
              </MDBRow>

              <MDBRow className="g-0">
                <MDBCol md="6">
                  <Form.Group classtitle="mb-3" controlId="category">
                        <Form.Label className='mt-3'>Category</Form.Label>
                        {/* <Form.Control
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        /> */}
                        <Select 
                          options={options} 
                          // onChange={(e) => setCategory(e.target.value)}
                          isMulti/>
                  </Form.Group>
                </MDBCol>

                <MDBCol md="1"></MDBCol>

                <MDBCol md="5">
                  <MDBRow className="g-0">
                    <MDBCol md="5">
                      <Form.Group classtitle="mb-3" controlId="title">
                          <Form.Label className='mt-3'>Price</Form.Label>
                          <Form.Control
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            type='number'
                          />
                      </Form.Group>
                    </MDBCol>

                    <MDBCol md="2"></MDBCol>

                    <MDBCol md="5">
                      <Form.Group classtitle="mb-3" controlId="title">
                            <Form.Label className='mt-3'>Count In Stock</Form.Label>
                            <Form.Control
                              value={countInStock}
                              onChange={(e) => setCountInStock(e.target.value)}
                              required
                              type='number'
                            />
                      </Form.Group>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>

              </MDBRow>
              <div className="d-flex justify-content-center">
                <div className="col-6 mt-4">
                  <div classtitle="mb-3">
                    <Button disabled={loadingUpdate} type="submit">
                      Update
                    </Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                  </div>
                </div>
              </div>
            </MDBRow>
            </MDBValidation>
          </MDBCardBody>
        </MDBCard>
        </div>
      )}
    </Container>
  );
}
