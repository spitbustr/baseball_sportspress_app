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

    if($num>0){
        $scoreSheet_arr=array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $scoresheet_items=array(
                "jsonObject" => $jsonObject,
                "gameId" => $gameId,
                "id" => $id,
                "seasonId" => $seasonId,
            );
            array_push($scoresheet_arr, $scoresheet_items);
        }
        http_response_code(200);
        echo json_encode($scoresheet_arr);
    }
    else {
        http_response_code(404);
        echo json_encode(
            array("message" => "No items found.")
        );
    }
?>