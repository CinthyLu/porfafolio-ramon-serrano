-- Script para actualizar roles EXTERNAL a USER
-- Paso 1: Eliminar el constraint antiguo que valida roles
-- Paso 2: Crear nuevo constraint con los roles correctos
-- Paso 3: Actualizar datos

-- 1. Verificar usuarios con rol EXTERNAL
SELECT id, email, role, created_at 
FROM users 
WHERE role = 'EXTERNAL';

-- 2. Eliminar el constraint antiguo
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_role;

-- 3. PRIMERO actualizar los datos (cambiar EXTERNAL a USER)
UPDATE users 
SET role = 'USER' 
WHERE role = 'EXTERNAL';

-- 4. DESPUÉS crear el nuevo constraint con los valores correctos
ALTER TABLE users ADD CONSTRAINT chk_role 
CHECK (role IN ('ADMIN', 'PROGRAMMER', 'USER'));

-- 5. Verificar el resultado final
SELECT id, email, role, created_at 
FROM users 
ORDER BY created_at DESC;
