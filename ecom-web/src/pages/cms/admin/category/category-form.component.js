import { Button, Col, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { getCategoryByType } from "../../../../services/category.service";
import { getLabelByType } from "../../../../services/label.service";
import Select from "react-select";

const CategoryForm = ({ handleSubmit, defaultData }) => {
  let logged_in_user = JSON.parse(localStorage.getItem("auth_user"));

  let [all_cats, setAllCats] = useState();
  let [all_brands, setAllBrands] = useState();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    status: Yup.string().required("Status is required"),
  });
  const formik = useFormik({
    initialValues: defaultData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      if (values.brands) {
        values.brands = values.brands.map((item) => item.value);
      }
      handleSubmit(values);
    },
  });

  const getAllCategories = async () => {
    try {
      let result = await getCategoryByType();
      setAllCats(result.result);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllBrands = async () => {
    try {
      let response = await getLabelByType("brand");
      let brands = response.result.map((item) => {
        return {
          label: item.title,
          value: item._id,
        };
      });
      setAllBrands(brands);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllBrands();
    if (defaultData) {
      // formik.setValues(defaultData);
      let sel_brands = [];
      let sel_cat = "";
      if (defaultData.brands) {
        sel_brands = defaultData.brands.map((item) => {
          return {
            label: item.title,
            value: item._id,
          };
        });
      }
      if (defaultData.parent_id) {
        sel_cat = defaultData.parent_id._id;
      }
      formik.setValues({
        ...defaultData,
        brands: sel_brands,
        parent_id: sel_cat,
      });
    }
  }, [defaultData]);

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="row mb-3" controlId="title">
          <Form.Label className="col-sm-3">Title:</Form.Label>
          <Col sm={9}>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter a category title."
              name="title"
              required={true}
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.errors.title && (
              <em className="text-danger">{formik.errors.title}</em>
            )}
          </Col>
        </Form.Group>

        <Form.Group className="row mb-3" controlId="parent_id">
          <Form.Label className="col-sm-3">Child Of:</Form.Label>
          <Col sm={9}>
            <Form.Select
              name="parent_id"
              required
              onChange={formik.handleChange}
              size={"sm"}
              value={formik.values.parent_id}
            >
              <option>--Select Any One</option>
              {all_cats &&
                all_cats.map((item, key) => (
                  <option value={item._id} key={key}>
                    {item.title}
                  </option>
                ))}
              {/* <option value="active">Active</option>
              <option value="inactive">Inactive</option> */}
            </Form.Select>
            {formik.errors.parent_id && (
              <em className="text-danger">{formik.errors.parent_id}</em>
            )}
          </Col>
        </Form.Group>

        <Form.Group className="row mb-3" controlId="brands">
          <Form.Label className="col-sm-3">Brands</Form.Label>
          <Col sm={9}>
            <Select
              name="brands"
              isMulti={true}
              options={all_brands}
              onChange={(e) => {
                formik.setValues({
                  ...formik.values,
                  brands: e,
                });
              }}
              size={"sm"}
              value={formik.values.brands}
            >
              <option>--Select Any One</option>
              {all_cats &&
                all_cats.map((item, key) => (
                  <option value={item._id} key={key}>
                    {item.title}
                  </option>
                ))}
              {/* <option value="active">Active</option>
              <option value="inactive">Inactive</option> */}
            </Select>
            {formik.errors.brands && (
              <em className="text-danger">{formik.errors.brands}</em>
            )}
          </Col>
        </Form.Group>

        <Form.Group controlId="formFileSm" className="row mb-3">
          <Form.Label className="col-sm-3">Image:</Form.Label>

          <div className="col-sm-3">
            <Form.Control
              type="file"
              size="sm"
              name="image"
              onChange={(e) => {
                let file = e.target.files[0];
                formik.setValues({
                  ...formik.values,
                  image: file,
                });
              }}
            />
          </div>
          <div className="col-sm-3">
            {formik.values.image && typeof formik.values.image === "object" ? (
              <img
                src={
                  formik.values.image &&
                  URL.createObjectURL(formik.values.image)
                }
                alt=""
                className="img img-fluid"
              />
            ) : (
              <img
                src={
                  process.env.REACT_APP_IMAGE_URL +
                  "/category/" +
                  formik.values.image
                }
                alt=""
                className="img img-fluid"
              />
            )}
          </div>
        </Form.Group>

        {logged_in_user && logged_in_user.role.includes("admin") ? (
          <Form.Group className="row mb-3" controlId="status">
            <Form.Label className="col-sm-3">Status:</Form.Label>
            <Col sm={9}>
              <Form.Select
                name="status"
                required
                onChange={formik.handleChange}
                size={"sm"}
                value={formik.values.status}
              >
                <option>--Select Any One</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
              {formik.errors.status && (
                <em className="text-danger">{formik.errors.status}</em>
              )}
            </Col>
          </Form.Group>
        ) : (
          <></>
        )}

        <Form.Group className="row mb-3" controlId="show_in_home">
          <Form.Label className="col-sm-3">Show In Home:</Form.Label>
          <Col sm={9}>
            <Form.Check
              size="sm"
              type="checkbox"
              label="Show in Home Page"
              name="show_in_home"
              value={1}
              onChange={formik.handleChange}
              checked={formik.values.show_in_home}
            />
          </Col>
        </Form.Group>

        <Form.Group className="row mb-3" controlId="title">
          <Col sm={{ offset: 3, span: 9 }}>
            <Button variant="danger" size="sm" type="reset" className="me-2">
              <i className="fa fa-trash"></i> Cancel
            </Button>
            <Button variant="success" size="sm" type="submit" className="me-2">
              <i className="fa fa-paper-plane"></i> Submit
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};

export default CategoryForm;
