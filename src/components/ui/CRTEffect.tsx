import classNames from 'classnames';
import React from 'react';

interface CRTEffectProps {
    className?: string;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({ className }) => {
    return (
        <div className={classNames(
            'pointer-events-none fixed inset-0 z-20',
            'before:fixed before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/10 before:opacity-50',
            'after:fixed after:inset-0 after:bg-[linear-gradient(transparent_0%,_rgba(32,_128,_32,_0.2)_2%,_rgba(32,_128,_32,_0.8)_3%,_rgba(32,_128,_32,_0.2)_3%,_transparent_100%)] after:bg-[length:100%_3px] after:animate-scan',
            className
        )}
        >
            {/* Scanlines */}
            <div className="fixed inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]" />

            {/* CRT flicker */}
            <div className="fixed inset-0 animate-flicker opacity-[0.02]" />

            {/* Vignette effect */}
            <div className="fixed inset-0 bg-radial-crt pointer-events-none" />
        </div>
    );
};

export default CRTEffect;
