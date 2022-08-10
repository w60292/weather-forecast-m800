export default function fetchData(url, formatter = (raw) => raw) {
  return fetch(url)
    .then(resp => resp.json())
    .then(data => formatter(data));
};
