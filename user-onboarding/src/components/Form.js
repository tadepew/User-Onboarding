import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { withFormik, Form, Field } from "formik";
import { Button, Label } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Form.css";

// Adding destructured 'errors' prop to the form. The 'errors' prop gets passed down from the 'withFormik' component.
//if there is an error, the erros.email shows you the error's message. touched makes it possible for you to avoid seeing validation errors as you're typing in the field the very first time
const LoginForm = ({ values, errors, touched, status }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    console.log("status has changed", status);
    status && setUser(user => [...user, status]);
  }, [status]);
  return (
    <div className="user-post">
      <h1>User Onboarding</h1>
      <Form>
        <div>
          {touched.name && errors.name && <p class="error">{errors.name}</p>}
          <Field type="text" name="name" placeholder="Name" />
        </div>

        <div>
          {touched.email && errors.email && <p class="error">{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email" />
        </div>
        <div>
          {touched.password && errors.password && (
            <p class="error">{errors.password}</p>
          )}
          <Field type="password" name="password" placeholder="Password" />
        </div>
        <div>
          {touched.confirm && errors.confirm && (
            <p class="error">{errors.confirm}</p>
          )}
          <Field
            type="password"
            name="confirm"
            placeholder="Confirm password"
          />
        </div>
        <div className="bottom-options">
          <div>
            {touched.role && errors.role && <p class="error">{errors.role}</p>}
            <Field component="select" name="role">
              <option disabled>Choose an option</option>
              <option value="Front-end">Front-end</option>
              <option value="Back-end">Back-end</option>
              <option value="UI">UI</option>
            </Field>
          </div>
          <div className="tos">
            {touched.tos && errors.tos && <p class="error">{errors.tos}</p>}
            <Field type="checkbox" name="tos" checked={values.tos} />
            <span> Accept Terms of Service</span>
          </div>
          <div>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </Form>
      {user.map(user => (
        <div class="input" key={user.id}>
          <p>
            <span>Name:</span> {user.name}
          </p>
          <p>
            <span>Email:</span> {user.email}
          </p>
          <p>
            <span>Role:</span> {user.role}
          </p>
        </div>
      ))}
    </div>
  );
};

const FormikOnboardForm = withFormik({
  mapPropsToValues({ name, email, password, confirm, tos, role }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      confirm: confirm || "",
      tos: tos || false,
      role: role || "Choose an option"
    };
  },

  //=====VALIDATION SCHEMA======
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .max(40, "Name cannot be longer than 40 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be 6 characters or longer")
      .required("Password is required"),
    // confirm: Yup.string()
    //   .min(6, "Password must be 6 characters or longer")
    //   .required("Password must match."),
    confirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirm is required"),
    role: Yup.string().oneOf(
      ["Front-end", "Back-end", "UI"],
      "Please select your role."
    ),
    tos: Yup.boolean().oneOf([true], "Must accept!")
  }),
  //=====END VALIDATION SCHEMA====
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting!", values);
    //THIS IS WHERE YOU DO YOUR FORM SUBMISSION CODE... HTTP REQUESTS, ETC.
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("sucess", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(LoginForm);

export default FormikOnboardForm;
