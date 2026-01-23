
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { IdentityNode } from './IdentityNode';
import { Identity } from '../../types/anuu';
import { Suspense } from 'react';

interface NeuralSceneProps {
    identities: Identity[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function NeuralScene({ identities, selectedId, onSelect }: NeuralSceneProps) {
    // Distribute nodes in a circle/sphere
    const radius = 6;

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
            {/* Environment */}
            <color attach="background" args={['#050510']} />
            <fog attach="fog" args={['#050510', 10, 25]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            <Suspense fallback={null}>
                <group>
                    {identities.map((identity, i) => {
                        // Calculate position on a circle
                        const angle = (i / identities.length) * Math.PI * 2;
                        const x = Math.cos(angle) * radius;
                        const z = Math.sin(angle) * radius * 0.5; // Slight ellipse
                        const y = Math.sin(angle * 2) * 2; // Wave pattern

                        return (
                            <IdentityNode
                                key={identity.titulo}
                                identity={identity}
                                position={[x, y, z]}
                                isSelected={selectedId === identity.titulo}
                                onClick={onSelect}
                            />
                        );
                    })}
                </group>
            </Suspense>

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                maxDistance={20}
                minDistance={5}
                autoRotate={!selectedId} // Rotate if nothing selected
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
}
