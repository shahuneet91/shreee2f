var files = [];
document.getElementById("files").addEventListener("change", function (e) {
  files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
});

document.getElementById("send").addEventListener("click", function () {
  debugger;
  //checks if files are selected
  if (files.length != 0) {
    debugger;
    //Loops through all the selected files
    for (let i = 0; i < files.length; i++) {
      //create a storage reference
      var storage = firebase.storage().ref(files[i].name);
    alert("Storage : " +storage);
      //upload file
      var upload = storage.put(files[i]);

      //update progress bar
      debugger
      upload.on(
        "state_changed",
        function progress(snapshot) {
          var percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          document.getElementById("progress").value = percentage;
        },function error() {
          alert("error uploading file");
        },function complete() {
          document.getElementById(
            "uploading"
          ).innerHTML += `${files[i].name} upoaded <br />`;
        }
      );
    }
  } else {
    alert("No file chosen");
  }
});

function getFileUrl(filename) {
  debugger;
  //create a storage reference
  var storage = firebase.storage().ref(filename);

  //get file url
  storage
    .getDownloadURL()
    .then(function (url) {
      console.log(url);
    })
    .catch(function (error) {
      console.log("error encountered");
    });
}
