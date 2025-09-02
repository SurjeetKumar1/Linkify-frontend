const { default: axios } = require("axios");


export const BASE_URL="https://linkify-backend-7n20.onrender.com"
// export const BASE_URL="http://ec2-34-228-223-161.compute-1.amazonaws.com:9090"

// export const BASE_URL="http://localhost:9090"

//ek instance create kar diya hai 
const clientServer=axios.create({
    baseURL:BASE_URL
})

export default clientServer;