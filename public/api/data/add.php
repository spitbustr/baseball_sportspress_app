<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/Database.php';
include_once '../models/Scoresheet.php';

$database = new Database();
$db = $database->getConnection();

$scoresheet = new Scoresheet($db);

// Check the request method
$method = $_SERVER['REQUEST_METHOD'];
if ($method === "POST") {
    // Use $_POST to get form data
    $data = array(
        "gameId" => isset($_POST["gameId"]) ? $_POST["gameId"] : "",
        "jsonObject" => isset($_POST["jsonObject"]) ? $_POST["jsonObject"] : ""
    );

    if (!empty($data["gameId"])) {
        $scoresheet->gameId = $data["gameId"];
        $scoresheet->jsonObject = $data["jsonObject"];

        if ($scoresheet->add()) {
            http_response_code(200);
            echo json_encode(array("message" => "Item added"));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error on server - 503", "item" => $scoresheet));
        }
    } else {
        http_response_code(403);
        echo json_encode(array("message" => "Error - 403", "item" => $scoresheet));
    }
} else {
    echo "WRONG METHOD";
}
?>