import { useState, useEffect } from "react";
import logger from "./logger";

function useApiPolling(apiFunction, delay) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiFunction();
                setData(response);
            } catch (error) {
                logger.error(error);
            }
        };

        const intervalId = setInterval(fetchData, delay);

        // Clear the interval on unmount
        return () => clearInterval(intervalId);
    }, [apiFunction, delay]);

    return data;
}

export { useApiPolling };