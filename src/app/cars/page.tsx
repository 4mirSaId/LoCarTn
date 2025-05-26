import React from "react";
import  CarList  from "./AllCarsList";

const CarPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Cars</h1>
            <CarList />
        </div>
    );
};

export default CarPage;
