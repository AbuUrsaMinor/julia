import { shaderMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { juliaFragmentShader, vertexShader } from '../../utils/shaders';

// Extend THREE.ShaderMaterial to include our uniforms
interface JuliaMaterialUniforms {
    c: { value: THREE.Vector2 };
    maxIterations: { value: number };
    colorA: { value: THREE.Vector3 };
    colorB: { value: THREE.Vector3 };
    isMandelbrot: { value: boolean };
}

const JuliaMaterial = shaderMaterial(
    {
        c: new THREE.Vector2(-0.4, 0.6),
        maxIterations: 100.0,
        colorA: new THREE.Vector3(0.0, 0.7, 0.9), // Neon blue
        colorB: new THREE.Vector3(0.9, 0.0, 0.7), // Neon pink
        isMandelbrot: false,
    },
    vertexShader,
    juliaFragmentShader
);

interface JuliaSetProps {
    position?: [number, number, number];
    scale?: number;
    mode?: 'julia' | 'mandelbrot';
}

export const JuliaSet: React.FC<JuliaSetProps> = ({
    position = [0, 0, 0],
    scale = 1,
    mode = 'julia'
}) => {
    const mesh = useRef<THREE.Mesh>(null);
    const material = useRef<THREE.ShaderMaterial & { uniforms: JuliaMaterialUniforms }>(null);

    // Create a more detailed geometry for better 3D effect
    const geometry = useMemo(() => {
        const resolution = 256; // Increased resolution for more detail
        return new THREE.PlaneGeometry(2, 2, resolution, resolution);
    }, []);

    // Animation loop for Julia set parameters
    useFrame((state) => {
        if (material.current?.uniforms) {
            if (mode === 'julia') {
                const time = state.clock.getElapsedTime();
                material.current.uniforms.c.value.x = -0.4 + Math.sin(time * 0.1) * 0.1;
                material.current.uniforms.c.value.y = 0.6 + Math.cos(time * 0.15) * 0.1;
            }
            material.current.uniforms.isMandelbrot.value = mode === 'mandelbrot';
        }
    });

    return (
        <mesh
            ref={mesh}
            position={position}
            scale={[scale, scale, scale]}
            rotation={[-Math.PI / 6, 0, 0]} // Tilt slightly for better 3D view
        >
            <primitive object={geometry} attach="geometry" />
            <primitive
                object={new JuliaMaterial()}
                ref={material as any}
                attach="material"
            />
        </mesh>
    );
};

export default JuliaSet;
