<?php
    class Database{
        private $conn;
        public function getConnection(){
            $config = parse_ini_file('config.ini');
            $this->conn = null;
            try{
                $this->conn = new PDO("mysql:host=" . $config['db_host'] . ";dbname=" .  $config['db_database'],  $config['db_user'], $config['db_password']);

            }catch(PDOException $exception){
                echo "Connection error: " . $exception->getMessage();
            }

            return $this->conn;
        }
    }
?>