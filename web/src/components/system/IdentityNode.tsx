
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Identity } from '../../types/anuu';

interface IdentityNodeProps {
    identity: Identity;
    position: [number, number, number];
    isSelected: boolean;
    onClick: (id: string) => void;
}

export function IdentityNode({ identity, position, isSelected, onClick }: IdentityNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    // Auto-rotation based on identity energy
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Base rotation
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;

            // If selected, pulse scale
            if (isSelected) {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
                meshRef.current.scale.set(scale, scale, scale);
            } else if (hovered) {
                meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    // Helper to extract color
    const getColor = (name: string) => {
        if (name.includes("Kali")) return "#ff0055";
        if (name.includes("Set")) return "#ff4400";
        if (name.includes("Anuket")) return "#00ccff";
        if (name.includes("Kilonova")) return "#ffd700";
        if (name.includes("4NVSET")) return "#00ff00";
        if (name.includes("Saze")) return "#cccccc";
        if (name.includes("Rosa")) return "#ffccff";
        if (name.includes("Kanuv")) return "#aaddff";
        return "#ffffff";
    };

    const color = getColor(identity.titulo);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(identity.titulo);
                    }}
                    onPointerOver={() => {
                        document.body.style.cursor = 'pointer';
                        setHover(true);
                    }}
                    onPointerOut={() => {
                        document.body.style.cursor = 'auto';
                        setHover(false);
                    }}
                    visible={true} // Add this to force render check
                >
                    <icosahedronGeometry args={[1, 1]} /> {/* Low poly look */}
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={isSelected || hovered ? 2 : 0.5}
                        wireframe={true}
                    />
                </mesh>

                {/* Initial Hover/Select Text */}
                {(hovered || isSelected) && (
                    <Text
                        position={[0, 1.5, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {identity.titulo.split("—")[0].trim().toUpperCase()}
                    </Text>
                )}
            </group>
        </Float>
    );
}
