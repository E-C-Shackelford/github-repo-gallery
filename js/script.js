// select the div with a class of “overview”
const overview = document.querySelector(".overview");
const username = "E-C-Shackelford";

// ***** FETCH API JSON DATA *****

// fetch info from GitHub profile using the GitHub API address, target the "users" endpoint, and add the global username variable to the endpoint
const githubUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  // console.log(data);
  displayUserInfo(data);
};

githubUserInfo();

// fetch and display user info
const displayUserInfo = function (data) {
  // create a new div and assign it a class of “user-info”
  const div = document.createElement("div");
  div.classList.add("user-info");
  // populate the div with the elements for figure, image, and paragraphs
  // inside the placeholders, use the JSON data to grab the relevant properties to display on the page
  div.innerHTMl = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
  overview.append(div);
};
