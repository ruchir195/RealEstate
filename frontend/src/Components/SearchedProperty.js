import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./explore.css";

export default function () {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (!auth) {
      navigate("/login");
    }
  }, []);

  const [database, setdatabase] = useState([]);
  var Data;
  var propertyFor = localStorage.getItem("propertyFor");
  console.log(propertyFor);
  // var propertyFor = "Sell";
  var type;
  var State;
  var City;
  var zone;
  var rooms;
  var price;
  
  if (propertyFor === "Sell") {
    Data = JSON.parse(localStorage.getItem("CombinedData"));

    State = Data.state;
    City = Data.cities;
    type = Data.property;
    zone = Data.area;
    var rtype = Data.type;
    rooms = parseInt(rtype.substring(0, 1));
    var pri = localStorage.getItem("Budget");
    let x = pri.indexOf("-");
    price = parseInt(pri.substring(x + 1));
  } else {
    Data = JSON.parse(localStorage.getItem("RentCombinedData"));
    State = Data.rentState;
    City = Data.rentCities;
    type = Data.rentProperty;
    zone = Data.rentArea;
    rtype = Data.rentType;
    rooms = parseInt(rtype.substring(0, 1));
    pri = localStorage.getItem("RentBudget");
    let x = pri.indexOf('-')
    price = parseInt(pri.substring(x+1));
  }

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const result = await fetch("http://localhost:5000/search-property", {
      method: "post",
      body: JSON.stringify({
        propertyFor,
        type,
        State,
        City,
        zone,
        rooms,
        price,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    var data = await result.json();
    setdatabase(data);
  }

  const nextPage = async () => {
    navigate("/otherproperty");
    // <OtherProperty
    //   propertyFor={propertyFor} type={type} State={State} City={City} zone={zone} price={price}
    // />;
    // const result = await fetch("http://localhost:5000/search-property-two", {
    //   method: "post",
    //   body: JSON.stringify({propertyFor, type, State, City,zone,price}),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // var data = await result.json();
    // setdatabase(data);
  };

  return (
    <>
      <h1 id="headingExplore"> Properties that matches your requirements </h1>
      <div className="mainExplore" style={{ maxWidth: "80%" }}>
        <ul className="cardsExplore">
          {database ? (
            database.map((ArrayOfObjects, index) => {
              // const imageNames = ArrayOfObjects.image[0];
              return (
                <li className="cards_item_explore" key={ArrayOfObjects._id}>
                  <div className="card" tabindex="0">
                    <h2 className="card_title_explore">
                      {" "}
                      {ArrayOfObjects.propertyFor} &#x2022; &#8377;
                      {ArrayOfObjects.price}{" "}
                    </h2>
                    <div className="card_image_explore">
                      {ArrayOfObjects.image &&
                      ArrayOfObjects.image.length > 0 ? (
                        <img
                          src={require(`../Images/${ArrayOfObjects.image[0]}`)}
                          key={ArrayOfObjects.image[0]}
                          alt="not fetched"
                        />
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="card_content_explore">
                      <div className="card_text_explore">
                        <p>
                          {" "}
                          <strong> Property Type: </strong>
                          {ArrayOfObjects.type}{" "}
                        </p>
                        <p>
                          {" "}
                          <strong>Location: </strong> {ArrayOfObjects.society},{" "}
                          {ArrayOfObjects.zone}, {ArrayOfObjects.City},{" "}
                          {ArrayOfObjects.State}.{" "}
                        </p>
                        <p>
                          {" "}
                          <strong>Pincode: </strong> {ArrayOfObjects.pincode}{" "}
                        </p>{" "}
                        <br />
                        <p className="facility_explore">
                          {" "}
                          <strong>Facility: </strong> {ArrayOfObjects.rooms} BHK{" "}
                          <br /> <strong>Land Area: </strong>{" "}
                          {ArrayOfObjects.area}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li>No Property Availabe with given requirements</li>
          )}
        </ul>
      </div>
      <div className="text-center">
        <button
          onClick={nextPage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {" "}
          Other Properties You May like{" "}
        </button>
      </div>
    </>
  );
}
