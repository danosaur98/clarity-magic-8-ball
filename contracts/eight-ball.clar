;; A simple 8 ball contract 
;;
;; Inspired / Adapted from https://github.com/friedger/clarity-smart-contracts/blob/master/contracts/experiments/flip-coin.clar

;; buffer for each option
(define-constant one-buffer 0x0008101820283038404850586068707880889098a0a8b0b8c0c8d0d8e0e8f0f8)
(define-constant two-buffer 0x0109111921293139414951596169717981899199a1a9b1b9c1c9d1d9e1e9f1f9)
(define-constant three-buffer 0x020a121a222a323a424a525a626a727a828a929aa2aab2bac2cad2dae2eaf2fa)
(define-constant four-buffer 0x030b131b232b333b434b535b636b737b838b939ba3abb3bbc3cbd3dbe3ebf3fb)
(define-constant five-buffer 0x040c141c242c343c444c545c646c747c848c949ca4acb4bcc4ccd4dce4ecf4fc)
(define-constant six-buffer 0x050d151d252d353d454d555d656d757d858d959da5adb5bdc5cdd5dde5edf5fd)
(define-constant seven-buffer 0x060e161e262e363e464e565e666e767e868e969ea6aeb6bec6ced6dee6eef6fe)
(define-constant eight-buffer 0x070f171f272f373f474f575f676f777f878f979fa7afb7bfc7cfd7dfe7eff7ff)

(define-constant zero 0x00)

;; private functions

;; used in (fold) to get last item of a buffer
(define-private (last (item (buff 1)) (value (buff 1)))
   item
)

;; used in (fold) to check if character is included in number option's buffer
(define-private (is-in-buffer (item (buff 1)) (state {value: (buff 1), result: bool}))
  (let ((val (get value state)))
    (if (is-eq item val )
      {value: val, result: true}
      state
    )
  )
)

;; public functions

;; get number result from byte
(define-read-only (get-decision (value (buff 1)))
    (if (get result (fold is-in-buffer one-buffer {value: value, result: false}))
        (ok "It is certain.")
        (if (get result (fold is-in-buffer two-buffer {value: value, result: false}))
            (ok "Outlook good.")
            (if (get result (fold is-in-buffer three-buffer {value: value, result: false}))
                (ok "You may rely on it.")
                (if (get result (fold is-in-buffer four-buffer {value: value, result: false}))
                    (ok "Ask again later.")
                    (if (get result (fold is-in-buffer five-buffer {value: value, result: false}))
                        (ok "Concentrate and ask again.")
                        (if (get result (fold is-in-buffer six-buffer {value: value, result: false}))
                            (ok "Reply hazy, try again.")
                            (if (get result (fold is-in-buffer seven-buffer {value: value, result: false}))
                                (ok "My reply is no.")
                                (if (get result (fold is-in-buffer eight-buffer {value: value, result: false}))
                                    (ok "My sources say no.")
                                    (err "Try again")
                                )
                            )
                        )
                    )
                )
            )
        )
    )
)

;; checks property of last byte of given buffer
;; returns eight ball decision
(define-read-only (get-eight-ball-decision-from-last (hash (buff 32)) )
  (let ((last-value (fold last hash zero)))
    (get-decision last-value)
  )
)

;; get eight ball decision by looking at the hash at the given block
;; returns returns eight ball decision
(define-read-only (get-eight-ball-decision-at (height uint))
  (let ((hash (unwrap-panic (get-block-info? header-hash height))))
    (get-eight-ball-decision-from-last hash)
  )
)
