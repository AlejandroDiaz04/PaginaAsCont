<?php
/**
 * Clase para manejar la conexión a PostgreSQL usando PDO
 */
class Database {
    private $conn;
    
    public function __construct() {
        $this->connect();
    }
    
    /**
     * Establece la conexión con PostgreSQL usando PDO
     */
    private function connect() {
        try {
            $dsn = sprintf(
                "pgsql:host=%s;port=%s;dbname=%s",
                DB_HOST,
                DB_PORT,
                DB_NAME
            );
            
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            
            // Establecer codificación UTF-8
            $this->conn->exec("SET NAMES 'UTF8'");
            
        } catch (PDOException $e) {
            error_log("Error de conexión: " . $e->getMessage());
            die("Error al conectar con la base de datos");
        }
    }
    
    /**
     * Retorna la conexión activa
     */
    public function getConnection() {
        return $this->conn;
    }
    
    /**
     * Ejecuta una consulta preparada
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error en query: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtiene todas las filas del resultado
     */
    public function fetchAll($stmt) {
        if ($stmt === false) return [];
        return $stmt->fetchAll();
    }
    
    /**
     * Obtiene una fila del resultado
     */
    public function fetch($stmt) {
        if ($stmt === false) return false;
        return $stmt->fetch();
    }
    
    /**
     * Obtiene el número de filas afectadas
     */
    public function affectedRows($stmt) {
        if ($stmt === false) return 0;
        return $stmt->rowCount();
    }
    
    /**
     * Escapa una cadena para prevenir inyección SQL
     */
    public function escape($string) {
        return $this->conn->quote($string);
    }
    
    /**
     * Cierra la conexión
     */
    public function close() {
        $this->conn = null;
    }
    
    /**
     * Destructor
     */
    public function __destruct() {
        $this->close();
    }
}
?>
