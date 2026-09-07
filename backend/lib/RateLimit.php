<?php
/**
 * Rate limiting simple por IP + bucket (archivos en storage/).
 * Pensado para hosting PHP compartido sin Redis.
 */
class RateLimit
{
    /**
     * @return bool true si la petición está permitida
     */
    public static function attempt($bucket, $max, $windowSeconds)
    {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
        $dir = __DIR__ . '/../storage/rate_limit';
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }

        $key = sha1($ip . '|' . $bucket);
        $file = $dir . '/' . $key . '.json';
        $now = time();

        $data = ['start' => $now, 'count' => 0];
        if (is_file($file)) {
            $raw = @file_get_contents($file);
            $parsed = $raw ? json_decode($raw, true) : null;
            if (is_array($parsed) && isset($parsed['start'], $parsed['count'])) {
                $data = $parsed;
            }
        }

        if (($now - (int) $data['start']) >= $windowSeconds) {
            $data = ['start' => $now, 'count' => 0];
        }

        if ((int) $data['count'] >= $max) {
            return false;
        }

        $data['count'] = (int) $data['count'] + 1;
        @file_put_contents($file, json_encode($data), LOCK_EX);
        return true;
    }

    public static function rejectJson($message = 'Demasiadas solicitudes. Intente más tarde.')
    {
        http_response_code(429);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => $message]);
        exit;
    }
}
