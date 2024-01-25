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
    // Initialize $data as an object
    $data = new stdClass();
    $input_data = file_get_contents('php://input');
    // Decode the JSON data
    $json_data = json_decode($input_data);

    // Access the properties
    $data->gameId = !empty($json_data->gameId) ? $json_data->gameId : "";
    $data->jsonObject = !empty($json_data->jsonObject) ? $json_data->jsonObject : "";
    $data->id = !empty($json_data->id) ? $json_data->id : "";
    echo json_encode(array("message" => $json_data));
    if (!empty($data->gameId)) {
        if ($scoresheet->add($data)) {
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