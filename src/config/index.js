const { default: axios } = require("axios");


// export const BASE_URL="https://social-media-plateform-vy0x.onrender.com"
export const BASE_URL="http://ec2-18-209-102-96.compute-1.amazonaws.com"

// export const BASE_URL="http://localhost:9090"

//ek instance create kar diya hai 
const clientServer=axios.create({
    baseURL:BASE_URL
})

export default clientServer;