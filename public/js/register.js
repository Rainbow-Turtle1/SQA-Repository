/* eslint-disable no-undef */
$("#registerForm").on("submit", async function (e) {
  e.preventDefault(); 
  const formData = $(this).serialize();

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const result = await response.json();

    $("#responseMessage").text(result.message);
    $("#responseModal").modal("show");

    $("#responseModal").on("hidden.bs.modal", function () {
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    });
  } catch (error) {
    console.error("Error occurred:", error);
    $("#responseMessage").text("An error occurred. Please try again.");
    $("#responseModal").modal("show");
  }
});
