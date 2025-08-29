;; Simple Blue Carbon Contract
(define-constant CONTRACT_OWNER tx-sender)
(define-data-var project-count uint u0)
(define-public (register-project) (begin (var-set project-count (+ (var-get project-count) u1)) (ok (var-get project-count)))
(define-read-only (get-project-count) (var-get project-count))