// select the div with a class of “overview”
const overview = document.querySelector(".overview");
const username = "E-C-Shackelford";
// select the unordered list to display the repos list
const reposList = document.querySelector(".repo-list");

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
  div.innerHTML = `
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
  githubRepos();
};

// ***** FETCH REPOS *****

const githubRepos = async function () {
  // find parameters to sort repos by the most recently updated to last updated as well as show up to 100 repos per page at a time
  const fetchRepos = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  // return the JSON response data for the repos
  const repoResponse = await fetchRepos.json();
  // console.log(repoResponse);
  displayRepos(repoResponse);
};
// githubRepos();  // confirmed it's fetching repositories, so commented out the call to the function — this step is needed to look through the properties

// display info regarding each repos
// ensure the function accepts the data returned from the last API call by passing the function repos as a parameter
const displayRepos = function (repos) {
  // loop and create a list item for each repo
  for (const repo of repos) {
    const li = document.createElement("li");
    // add the "repo" class to each item
    li.classList.add(".repo");
    // add an <h3> element with the repo name to each item
    li.innerHTML = `<h3>${repo.name}</h3>`;
    // append the list item to the global variable selecting the unordered repos list
    reposList.append(li);
  }
};
