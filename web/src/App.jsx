import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {

  const [products, setProducts] = useState([]);
  const [loadProduct, setLoadProduct] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const[update,setupdate]=useState(false);


  const getAllProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/products`)
      console.log("response: ", response.data);

      setProducts(response.data.data)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5001/product/${id}`)
      console.log("response: ", response.data);

      setLoadProduct(!loadProduct)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const editMode = (product) => {
    setupdate(true);
    setIsEditMode(!isEditMode)
    setEditingProduct(product)

    editFormik.setFieldValue("productName", product.name)
    editFormik.setFieldValue("productPrice", product.price)
    editFormik.setFieldValue("productDescription", product.description)

  }

  useEffect(() => {

    getAllProducts()

  }, [loadProduct])


  const myFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product price is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product description is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);
      myFormik.resetForm({values:''});

      axios.post(`http://localhost:5001/product`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });


  const editFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product price is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product description is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);
      setupdate(false);

      axios.put(`http://localhost:5001/product/${editingProduct._id}`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });


  return (
    <>
      <div className='container'>
        <div class="header">
          <h1 class="heading">Add Your Product</h1>
        </div>
        <form className='inputf' onSubmit={myFormik.handleSubmit}>
          <input
            id="productName"
            placeholder="Product Name"
            value={myFormik.values.productName}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.productName && Boolean(myFormik.errors.productName)) ?
              <span style={{ color: "red" }}>{myFormik.errors.productName}</span>
              :
              null
          }

          <br />
          <input
            id="productPrice"
            placeholder="Product Price"
            value={myFormik.values.productPrice}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.productPrice && Boolean(myFormik.errors.productPrice)) ?
              <span style={{ color: "red" }}>{myFormik.errors.productPrice}</span>
              :
              null
          }

          <br />
          <input
            id="productDescription"
            placeholder="Product Description"
            value={myFormik.values.productDescription}
            onChange={myFormik.handleChange}
          />
          {
            (myFormik.touched.productDescription && Boolean(myFormik.errors.productDescription)) ?
              <span style={{ color: "red" }}>{myFormik.errors.productDescription}</span>
              :
              null
          }

          <br />
          <div className="button">
            <button type="submit"> Submit </button>
          </div>

        </form>

        <br />
        <br />

      </div>



      <div className='my' >
        <h1>All Products</h1 >
        <table>
          <tr>
            <th>Product Name</th>
            <th>Product Price</th>
            <th>Product Description</th>
            <th></th>
          </tr>

          {products.map((eachProduct, i) => (
            <tr key={eachProduct._id}>
              <td>{eachProduct.name}</td>
              <td>{eachProduct.price}</td>
              <td>{eachProduct.description}</td>
              <td style={{
                display:"flex",
                gap:"20px"
              }}>
              <button onClick={() => {
              deleteProduct(eachProduct._id)
            }}>delete</button>

            <button onClick={() => {
              editMode(eachProduct)
            }}>edit</button>
              </td>

 {(isEditMode && editingProduct._id === eachProduct._id && update === true) ?
              <div>

                <form onSubmit={editFormik.handleSubmit}>
                  <input
                    id="productName"
                    placeholder="Product Name"
                    value={editFormik.values.productName}
                    onChange={editFormik.handleChange}
                  />
                  <br /> <br />
                  {
                    (editFormik.touched.productName && Boolean(editFormik.errors.productName)) ?
                      <span style={{ color: "red" }}>  {editFormik.errors.productName}</span>
                      :
                      null
                  }

                  <br />
                  <input
                    id="productPrice"
                    placeholder="Product Price"
                    value={editFormik.values.productPrice}
                    onChange={editFormik.handleChange}
                  />
                  {
                    (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ?
                      <span style={{ color: "red" }}>{editFormik.errors.productPrice}</span>
                      :
                      null
                  }

                  <br />
                  <input
                    id="productDescription"
                    placeholder="Product Description"
                    value={editFormik.values.productDescription}
                    onChange={editFormik.handleChange}
                  />
                  {
                    (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ?

                      <span style={{ color: "red" }}> {editFormik.errors.productDescription}</span>
                      :
                      null
                  }

                  <br />
                  <button type="submit"> Submit </button>
                </form>

              </div> : null}



            </tr>



        ))}
        </table>
      </div>

    </>

  );
}

export default App;