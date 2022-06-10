"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all-stories", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $mainNavLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks the submit nav link, reveal the form to submit a new story. */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}

$navSubmitStory.on("click", navSubmitClick);

/** When a user clicks the nav favorites link, reveal the favorite story list */

function navFavoritesClick(e) {
  console.debug("navFavoritesClick", e);
  hidePageComponents();
  // call function to add favorites list component to page
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavoritesClick);

/** When a user clicks the nav my stories link, reveal their own story list */

function navMyStoriesClick(e) {
  console.debug("navMyStoriesClick", e);
  hidePageComponents();
  // call function to add favorites list component to page
  putMyStoriesOnPage();
}

$navMyStories.on("click", navMyStoriesClick);

/** When a user clicks the nav profile username, reveal their user profile component */

function navProfileClick(e) {
  console.debug("navProfileClick", e);
  hidePageComponents();
  // take hidden class off of profile component/section
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);
