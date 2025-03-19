import React from "react";
import { Container } from "react-bootstrap";
import ProfileEdit from "../components/profile/ProfileEdit";

const ProfileEditPage = () => {
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <ProfileEdit />
        </div>
      </div>
    </Container>
  );
};

export default ProfileEditPage;
