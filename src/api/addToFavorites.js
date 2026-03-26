import axios from "@/api/axios";

const getUrl = slug => `/articles/${slug}/favorite`

const mapFavoriteResponse = response => response.data.article

const addToFavorites = slug => {
    const url = getUrl(slug)
    return axios.post(url).then(mapFavoriteResponse)
}

const removeFromFavorites = slug => {
    const url = getUrl(slug)
    return axios.delete(url).then(mapFavoriteResponse)
}

export default {
    addToFavorites,
    removeFromFavorites
}