import dispatcher from "../dispatcher";
import config from '../config/config';
//import loginauth from '../auth/loginauth';

// export function fetchVoices(property_id, master_id) {
//
//   var url = config.ENDPOINT_URL + 'getVoices';
//   axios({
//           method: 'post',
//           url: url,
//           headers: {
//              'Authorization': loginauth.AUTHTOKEN
//            },
//           data: {
//             property_id,
//             master_id
//           }
//         })
//         .then(function (response) {
//           //console.log(response);
//           dispatcher.dispatch({
//             type: "GET_VOICES",
//             data: response.data,
//           });
//
//         })
//         .catch(function (error) {
//           console.log(error);
//         });
//
// }
