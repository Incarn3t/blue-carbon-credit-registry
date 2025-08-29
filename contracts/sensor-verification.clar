;; Sensor Verification Smart Contract
;; Verifies IoT sensor data and satellite imagery for carbon projects

(define-constant CONTRACT_OWNER tx-sender)

(define-data-var verifications (map uint (tuple
  (project-id uint)
  (verifier principal)
  (verification-type (string-ascii 20))
  (data-hash (string-ascii 64))
  (score uint)
  (status (string-ascii 20))
  (timestamp uint)
)) u0)

(define-data-var next-verification-id uint u0)

;; Submit a new verification
(define-public (submit-verification
  (project-id uint)
  (verification-type (string-ascii 20))
  (data-hash (string-ascii 64))
  (score uint)
)
  (begin
    (asserts! (> score u0) (err "Score must be greater than 0"))
    (asserts! (<= score u100) (err "Score must be 100 or less"))
    
    (let ((verification-id (var-get next-verification-id))
          (current-time (block-height)))
      (var-set verifications verification-id (tuple
        (project-id project-id)
        (verifier tx-sender)
        (verification-type verification-type)
        (data-hash data-hash)
        (score score)
        (status "pending")
        (timestamp current-time)
      ))
      (var-set next-verification-id (+ verification-id u1))
      (ok verification-id)
    )
  )
)

;; Get verification details
(define-read-only (get-verification (verification-id uint))
  (map-get? verifications verification-id)
)

;; Initialize verification system
(define-public (initialize-verification)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err "Only contract owner can initialize"))
    (ok true)
  )
)

