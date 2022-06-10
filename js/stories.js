"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.debug("getAndShowStoriesOnStart");
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrashcan = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // only display stars on list markup if a user is currently logged in
  const displayStar = currentUser ? true : false;
  return $(`
      <li id="${story.storyId}">
        ${showTrashcan ? createTrashcanMarkup() : ""}
        ${displayStar ? createStarMarkup(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Constructs markup for star on list items/stories */

function createStarMarkup(story, user) {
  const star = currentUser.userHasFavorite(story) ? "fas" : "far";
  const starHtml = `<span><i class="${star} fa-star star"></i></span>`;
  return starHtml;
}

/** Constructs markup for trashcan for user to delete own story */

function createTrashcanMarkup() {
  return `<span><i class="fa-trash-alt fas trash"></i></span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Get data from the submit story form, call .addStory method that sends data to API, and put new story on the page */

async function submitNewStory(e) {
  console.debug("submitNewStory", e);
  e.preventDefault();

  // debugger;
  // get data from form
  const author = $("#submit-author").val();
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();
  const username = currentUser.username;

  const newStory = { title, author, url, username };

  // call .addStory
  const story = await storyList.addStory(currentUser, newStory);

  // puts new story on the page
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  // reset and hide form
  $submitStoryForm.trigger("reset");
  $submitStoryForm.slideUp("fast");
}

$submitStoryForm.on("submit", submitNewStory);

/** Display favorites list component on the page */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnpage");

  $favoriteStoriesList.empty();
  // check to see if user has favorites in array
  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<p>No favorites have been added!</p>");
  } else {
    currentUser.favorites.forEach((story) => {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    });
  }

  $favoriteStoriesList.show();
}

/** Display user's own stories list component on the page */

function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnpage");

  $myStoriesList.empty();
  // check to see if user has favorites in array
  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<p>You have not submitted any stories yet!</p>");
  } else {
    currentUser.ownStories.forEach((story) => {
      const $story = generateStoryMarkup(story, true);
      $myStoriesList.append($story);
    });
  }

  $myStoriesList.show();
}

/** Delete story from user profile and API */

async function deleteStory(e) {
  console.debug("deleteStory");
  const $liParent = $(e.target).closest("li");
  console.log($liParent.attr("id"));
  const id = $liParent.attr("id");
  await storyList.removeStory(currentUser, id);
  putMyStoriesOnPage();
}

$myStoriesList.on("click", ".trash", deleteStory);

/** Favorite/unfavorite story on UI */

async function toggleFavorite(e) {
  console.debug("toggleFavorite");
  // find the parent li and get the id attribute off itm which is storyId
  const $target = $(e.target);
  const $parentLi = $target.closest("li");
  const id = $parentLi.attr("id");
  // find the story using its id
  const story = storyList.stories.find((s) => s.storyId === id);
  // if target star has far class, then story is not favorited
  if ($target.hasClass("far")) {
    // add story to faovite using class method from user
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    // unfavorite story
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$allThreeLists.on("click", ".star", toggleFavorite);
