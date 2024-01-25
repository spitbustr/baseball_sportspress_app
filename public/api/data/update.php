<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    include_once '../config/Database.php';
    include_once '../models/Scoresheet.php';

    $database = new Database();
    $db = $database->getConnection();

    $scoresheet = new Scoresheet($db);

    $stmt = $scoresheet->getAll();
    $num = $stmt->rowCount();
    // Check the request method
    $method = $_SERVER['REQUEST_METHOD'];
    if($method === "POST") {
        // Initialize $data as an object
        $data = new stdClass();
        $input_data = file_get_contents('php://input');
        // Decode the JSON data
        $json_data = json_decode($input_data);

        // Access the properties
        $data->gameId = !empty($json_data->gameId) ? $json_data->gameId : "";
        $data->jsonObject = !empty($json_data->jsonObject) ? $json_data->jsonObject : "";

        if(!empty($data->gameId)) {
            if ($scoresheet->updateById($data)) {
                http_response_code(200);
                echo json_encode(array("message" => "Item updated successfully."));
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Unable to update item."));
            }
        }
        else {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid request. 'id' parameter is missing."));
        }
    } else {
        echo "WRONG METHOD";
    }


?>