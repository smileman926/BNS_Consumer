import React, { useEffect } from "react";
import { Form } from "react-bootstrap";

function AddressInput(props) {
  const { onChange, ...rest } = props;
  const { google } = window;
  const autocompleteInput = React.createRef();

  useEffect(() => {
    if (google) {
      const autoComplete = new google.maps.places.Autocomplete(
        autocompleteInput.current,
        { types: ["geocode"], componentRestrictions: { country: "us" } }
      );
      autoComplete.addListener("place_changed", () => {
        onChange(autoComplete.getPlace().formatted_address);
      });
    }
  }, [google]);

  return (
    <Form.Control
      {...rest}
      onChange={({ target }) => onChange(target.value)}
      type="text"
      ref={autocompleteInput}
      style={{ position: "relative", zIndex: "1020" }}
    />
  );
}

export default AddressInput;
