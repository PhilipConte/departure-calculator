export async function wmataRequest(url) {
  console.log(`request to ${url}`)
  const response = await fetch(url, {
    headers: {
      api_key: 'e13626d03d8e4c03ac07f95541b3091b' // https://developer.wmata.com/
    }
  });
  return await response.json();
}
