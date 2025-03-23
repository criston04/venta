// Custom hook for managing sales
import { useState, useEffect } from 'react';

const useSales = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        // Fetch sales data from an API or database
        const fetchSales = async () => {
            // Example API call
            const response = await fetch('/api/sales');
            const data = await response.json();
            setSales(data);
        };

        fetchSales();
    }, []);

    return sales;
};

export default useSales;
