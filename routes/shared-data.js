// this file is temporary, and will be removed once we user authentication is implemented

let accountProfilePicture = 0;

export function getAccountProfilePicture() {
  return accountProfilePicture;
}

export function setAccountProfilePicture(index) {
  accountProfilePicture = index;
}

export const profilePicturePaths = [
  "resources/profile-images/grey-profile-icon.png",
  "resources/profile-images/red-profile-icon.png",
  "resources/profile-images/green-profile-icon.png",
  "resources/profile-images/blue-profile-icon.png",
  "resources/profile-images/orange-profile-icon.png",
  "resources/profile-images/yellow-profile-icon.png",
  "resources/profile-images/turquoise-profile-icon.png",
  "resources/profile-images/purple-profile-icon.png",
  "resources/profile-images/pink-profile-icon.png",
  "resources/profile-images/black-profile-icon.png",
];
