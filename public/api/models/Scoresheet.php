<?php
    class ScoreSheet {
        private $conn;
        private $table_name = "Scoresheet";

        public $id;
        public $gameId;
        public $jsonObject;



        public function __construct($db){
            $this->conn = $db;
        }

        function getAll(){
            $query = "SELECT * FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return $stmt;
        }
        function getByGameId($gameId){
            $query = "SELECT * FROM " . $this->table_name . " WHERE gameId = :gameId";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':gameId', $gameId);
            $stmt->execute();
            return $stmt;
        }

        function getById($id){
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':gameId', $id);
            $stmt->execute();
            return $stmt;
        }

        function add($newData){
            $query = "INSERT INTO " . $this->table_name . " (gameId, jsonObject) VALUES (:gameId, :jsonObject)";

            // prepare query
            $stmt = $this->conn->prepare($query);
            // Bind parameters
            // Create temporary variables to store casted values
            $jsonObject = (string)json_encode($newData->jsonObject);
            $gameId = (string)$newData->gameId;

            $stmt->bindParam(":gameId", $gameId);
            $stmt->bindParam(":jsonObject", $jsonObject);
            // execute query
            if($stmt->execute()){
                $this->conn = null;
                return true;
            }
            die("Error: There is an error somewhere in the Insert method");
            $this->conn = null;
            return false;
        }

        function remove($id) {
            $query = "DELETE FROM ". $this->table_name . " WHERE id = :id";
            // prepare query
            $stmt = $this->conn->prepare($query);
            // bind values
            $stmt->bindParam(":id", $id);
            if($stmt->execute()){
                $this->conn = null;
                return true;
            }
            die("Error: Couldn't find what you were looking for");
            $this->conn = null;
            return false;
        }

        function updateById($newData) {
            $query = "UPDATE " . $this->table_name . " SET jsonObject = :jsonObject WHERE gameId = :gameId";
            $stmt = $this->conn->prepare($query);
            // Bind parameters
            // Create temporary variables to store casted values
            $jsonObject = (string)json_encode($newData->jsonObject);
            $gameId = (string)$newData->gameId;

            $stmt->bindParam(':jsonObject',$jsonObject);
            $stmt->bindParam(':gameId', $gameId);

            if ($stmt->execute()) {
                echo json_encode(array("message" => "Worked"));
                return true;
            } else {
                echo json_encode(array("message" => "Error"));
                return false;
            }
        }
    }

?>