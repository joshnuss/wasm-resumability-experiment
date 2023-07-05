(module
  (import "js" "mem" (memory 1 2 shared))

  (func (export "read") (result i32)
    ;; set memory index
    i32.const 0

    ;; load memory value
    i32.load
  )

  (func (export "increment") (result i32)
    ;; set memory index
    i32.const 0
    ;; set memory index
    i32.const 0

    ;; load memory value
    i32.load

    ;; increment by 1
    i32.const 1
    i32.add

    ;; store in memory
    i32.store

    ;; return latest value
    i32.const 0
    i32.load
  )
)
