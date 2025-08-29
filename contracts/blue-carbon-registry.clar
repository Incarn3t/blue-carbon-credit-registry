;; Blue Carbon Registry Smart Contract
;; Manages blue carbon projects

(define-constant CONTRACT_OWNER tx-sender)

(define-data-var projects (map uint (tuple
  (owner principal)
  (name (string-ascii 100))
  (description (string-ascii 500))
  (location (string-ascii 200))
  (project-type (string-ascii 50))
  (area-hectares uint)
  (carbon-sequestration-rate uint)
  (verification-status (string-ascii 20))
  (created-at uint)
)) u0)

(define-data-var next-project-id uint u0)

;; Register a new blue carbon project
(define-public (register-project
  (name (string-ascii 100))
  (description (string-ascii 500))
  (location (string-ascii 200))
  (project-type (string-ascii 50))
  (area-hectares uint)
  (carbon-sequestration-rate uint)
)
  (begin
    (asserts! (> area-hectares u0) (err "Area must be greater than 0"))
    (asserts! (> carbon-sequestration-rate u0) (err "Sequestration rate must be greater than 0"))
    
    (let ((project-id (var-get next-project-id))
          (current-time (block-height)))
      (var-set projects project-id (tuple
        (owner tx-sender)
        (name name)
        (description description)
        (location location)
        (project-type project-type)
        (area-hectares area-hectares)
        (carbon-sequestration-rate carbon-sequestration-rate)
        (verification-status "pending")
        (created-at current-time)
      ))
      (var-set next-project-id (+ project-id u1))
      (ok project-id)
    )
  )
)

;; Get project details
(define-read-only (get-project (project-id uint))
  (map-get? projects project-id)
)

;; Initialize registry
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err "Only contract owner can initialize"))
    (ok true)
  )
)
