;; Blue Carbon Marketplace Smart Contract
;; Enables trading of verified blue carbon credits

(define-constant CONTRACT_OWNER tx-sender)

(define-data-var listings (map uint (tuple
  (seller principal)
  (amount uint)
  (price-per-credit uint)
  (status (string-ascii 20))
  (created-at uint)
)) u0)

(define-data-var next-listing-id uint u0)

;; Create a new listing for carbon credits
(define-public (create-listing (amount uint) (price-per-credit uint))
  (begin
    (asserts! (> amount u0) (err "Amount must be greater than 0"))
    (asserts! (> price-per-credit u0) (err "Price must be greater than 0"))
    
    (let ((listing-id (var-get next-listing-id))
          (current-time (block-height)))
      (var-set listings listing-id (tuple
        (seller tx-sender)
        (amount amount)
        (price-per-credit price-per-credit)
        (status "active")
        (created-at current-time)
      ))
      (var-set next-listing-id (+ listing-id u1))
      (ok listing-id)
    )
  )
)

;; Get listing details
(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id)
)

;; Initialize marketplace
(define-public (initialize-marketplace)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err "Only contract owner can initialize"))
    (ok true)
  )
)
