export const DRINKS = [
    { id: 'water', name: 'ICED WATER', minutes: 15, liqC: '#7EC8E3', liqS: '#5AADCC', iceC: '#D8EFFF', iceHi: '#F8FCFF', glH: '#EBF5FC', glR: '#9FC8DA', badge: 'EASY', badgeClr: '#4ECDC4', tag: 'a quick focus sprint', doneMsg: 'Clean & refreshing!', straw: false, balls: false, slice: false, cream: false, strawClr: null },
    { id: 'coffee', name: 'ICED COFFEE', minutes: 25, liqC: '#2E1408', liqS: '#1A0A04', iceC: '#EDE0D2', iceHi: '#FAF6F0', glH: '#F8F2EC', glR: '#C0946A', badge: 'GRIND', badgeClr: '#FFD60A', tag: 'a productive session', doneMsg: 'Bold, dark & perfect!', straw: true, balls: false, slice: false, cream: true, strawClr: '#5C3317' },
    { id: 'boba', name: 'BOBA TEA', minutes: 35, liqC: '#C08A50', liqS: '#9A6A38', iceC: '#F8F0E0', iceHi: '#FFFCF5', glH: '#FFF7EC', glR: '#C8A060', badge: 'MED+', badgeClr: '#FF85A1', tag: 'a deep work block', doneMsg: 'Chewy & delicious!', straw: true, balls: true, slice: false, cream: false, strawClr: '#FF85A1', ballClr: '#100600' },
    { id: 'lemonade', name: 'LEMONADE', minutes: 45, liqC: '#EDDA50', liqS: '#CCBA28', iceC: '#FFFDE0', iceHi: '#FFFFFF', glH: '#FFFEF5', glR: '#D8C030', badge: 'HARD', badgeClr: '#FF6B35', tag: 'a serious study sesh', doneMsg: 'Zesty & rewarding!', straw: true, balls: false, slice: true, cream: false, strawClr: '#FF6B35' },
    { id: 'smoothie', name: 'SMOOTHIE', minutes: 60, liqC: '#FF6B9D', liqS: '#DC4878', iceC: '#FFE8F2', iceHi: '#FFF5FA', glH: '#FFF2F8', glR: '#FFA0C0', badge: 'HERO', badgeClr: '#8B5CF6', tag: 'the ultimate grind', doneMsg: 'YOU ARE A LEGEND!', straw: true, balls: false, slice: false, cream: false, strawClr: '#8B5CF6' }
];

export const S = 4;
export const GL = {
    rimX1: 5, rimX2: 35, rimY: 4,
    wX1: 6, wX2: 34, wY1: 6, wY2: 50,
    bX1: 7, bX2: 33, bY1: 50, bY2: 53,
    iX1: 9, iX2: 31, iY1: 7, iY2: 49,
    stX: 28, stY1: 0, stY2: 15
};
export const IW = GL.iX2 - GL.iX1;
export const IH = GL.iY2 - GL.iY1;

export function r(ctx, lx, ly, lw, lh, c) { ctx.fillStyle = c; ctx.fillRect(lx * S, ly * S, lw * S, lh * S); }
export function p(ctx, lx, ly, c) { ctx.fillStyle = c; ctx.fillRect(lx * S, ly * S, S, S); }
export function ltn(hex) {
    const n = parseInt(hex.slice(1), 16), R = Math.min(255, ((n >> 16) & 255) + 70), G = Math.min(255, ((n >> 8) & 255) + 70), B = Math.min(255, (n & 255) + 70);
    return `rgb(${R},${G},${B})`;
}

export function drawDrink(canvas, drink, prog, t, drips = []) {
    if (!canvas || !drink) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    prog = Math.max(0, Math.min(1, prog));

    if (drink.straw && drink.strawClr) {
        r(ctx, GL.stX, GL.stY1, 2, GL.stY2, drink.strawClr);
        r(ctx, GL.stX, GL.stY1, 1, GL.stY2, ltn(drink.strawClr));
        r(ctx, GL.stX - 2, GL.stY2 - 2, 4, 2, drink.strawClr);
    }
    r(ctx, GL.wX1, GL.wY1, GL.wX2 - GL.wX1, GL.wY2 - GL.wY1, drink.glH);

    const iceLogH = Math.ceil(IH * (1 - prog));
    const liqLogY = GL.iY1 + iceLogH;
    const liqLogH = IH - iceLogH;

    if (liqLogH > 0) {
        r(ctx, GL.iX1, liqLogY, IW, liqLogH, drink.liqC);
        r(ctx, GL.iX2 - 2, liqLogY, 2, liqLogH, drink.liqS);
        if (liqLogH > 3) r(ctx, GL.iX1, GL.iY2 - 2, IW, 2, drink.liqS);
    }
    if (drink.balls && liqLogH > 4) {
        const bc = drink.ballClr || '#100600';
        [[10, 46], [14, 47], [18, 46], [22, 47], [26, 46], [12, 43], [16, 44], [20, 43], [24, 44]].forEach(([bx, by]) => {
            if (by > liqLogY && by < GL.iY2) {
                r(ctx, bx, by, 2, 2, bc);
                p(ctx, bx, by, 'rgba(255,255,255,.22)');
            }
        });
    }
    if (drink.slice && prog < 0.55) {
        const sx = GL.iX2 - 1, sy = GL.iY1 + 3;
        r(ctx, sx, sy, 4, 6, '#F0D020'); r(ctx, sx + 1, sy + 1, 2, 4, '#FFEE80');
        r(ctx, sx, sy, 4, 1, '#C8A800'); r(ctx, sx, sy + 5, 4, 1, '#C8A800');
        r(ctx, sx, sy, 1, 6, '#C8A800'); r(ctx, sx + 3, sy, 1, 6, '#C8A800');
    }
    if (drink.cream && liqLogH > 6) r(ctx, GL.iX1 + 2, liqLogY, IW - 4, 2, '#D4A878');

    if (iceLogH > 0) {
        r(ctx, GL.iX1, GL.iY1, IW, iceLogH, drink.iceC);
        r(ctx, GL.iX1, GL.iY1, IW, 2, drink.iceHi);
        r(ctx, GL.iX1, GL.iY1, 2, iceLogH, drink.iceHi);
        r(ctx, GL.iX2 - 2, GL.iY1, 2, iceLogH, '#A8C8E0');
        if (iceLogH > 3) r(ctx, GL.iX1, GL.iY1 + iceLogH - 2, IW, 2, '#CCEEFF');
        if (iceLogH > 8) {
            ctx.fillStyle = 'rgba(200,235,255,.35)';
            ctx.fillRect((GL.iX1 + 4) * S, (GL.iY1 + 2) * S, 4 * S, (iceLogH - 6) * S);
        }
        if (prog > 0.30 && iceLogH > 5) {
            ctx.fillStyle = 'rgba(160,210,255,.5)';
            ctx.fillRect((GL.iX1 + 3) * S, Math.round(GL.iY1 + iceLogH * 0.44) * S, (IW - 6) * S, S);
        }
        if (prog > 0.55 && iceLogH > 5) {
            ctx.fillStyle = 'rgba(160,210,255,.5)';
            ctx.fillRect((GL.iX1 + 5) * S, Math.round(GL.iY1 + iceLogH * 0.72) * S, (IW - 10) * S, S);
        }
        if (prog > 0.02) {
            const edgeRow = GL.iY1 + iceLogH - 1;
            for (let col = 0; col < IW; col++) {
                const w = Math.sin(col * 1.15 + t * 0.026) * 0.5 + Math.sin(col * 0.72 + t * 0.019 + 1.3) * 0.5;
                if (w > 0.15) p(ctx, GL.iX1 + col, edgeRow, drink.liqC);
            }
        }
    }

    if (drips) {
        drips.forEach(d => {
            if (d.ly > GL.iY1 && d.ly < GL.iY2) {
                ctx.fillStyle = drink.iceC;
                ctx.fillRect(d.lx * S, Math.floor(d.ly) * S, S, S);
            }
        });
    }

    r(ctx, GL.rimX1, GL.rimY, GL.rimX2 - GL.rimX1, 2, drink.glR);
    r(ctx, GL.rimX1, GL.rimY, GL.rimX2 - GL.rimX1, 1, '#ffffff');
    r(ctx, GL.wX1, GL.wY1, 3, GL.wY2 - GL.wY1, drink.glR);
    r(ctx, GL.wX1, GL.wY1, 1, GL.wY2 - GL.wY1, 'rgba(255,255,255,.5)');
    r(ctx, GL.wX2 - 3, GL.wY1, 3, GL.wY2 - GL.wY1, drink.glR);
    r(ctx, GL.bX1, GL.bY1, GL.bX2 - GL.bX1, GL.bY2 - GL.bY1, drink.glR);
    r(ctx, GL.bX1 + 1, GL.bY1, GL.bX2 - GL.bX1 - 2, 1, '#ffffff');
    r(ctx, GL.bX1 + 2, GL.bY2, GL.bX2 - GL.bX1 - 4, 2, '#88A8C0');

    const D = '#1A1A2E';
    ctx.fillStyle = D;
    ctx.fillRect(GL.rimX1 * S, GL.rimY * S, (GL.rimX2 - GL.rimX1) * S, S);
    ctx.fillRect(GL.rimX1 * S, (GL.rimY + 2) * S, (GL.rimX2 - GL.rimX1) * S, S);
    ctx.fillRect(GL.wX1 * S, GL.wY1 * S, S, (GL.wY2 - GL.wY1) * S);
    ctx.fillRect((GL.wX2 - 1) * S, GL.wY1 * S, S, (GL.wY2 - GL.wY1) * S);
    ctx.fillRect(GL.bX1 * S, GL.bY1 * S, (GL.bX2 - GL.bX1) * S, S);
    ctx.fillRect(GL.bX1 * S, (GL.bY2 - 1) * S, (GL.bX2 - GL.bX1) * S, S);
    ctx.fillRect(GL.bX1 * S, GL.bY1 * S, S, (GL.bY2 - GL.bY1) * S);
    ctx.fillRect((GL.bX2 - 1) * S, GL.bY1 * S, S, (GL.bY2 - GL.bY1) * S);

    ctx.fillStyle = 'rgba(255,255,255,.38)';
    ctx.fillRect((GL.wX1 + 1) * S, (GL.wY1 + 2) * S, S, (GL.wY2 - GL.wY1 - 4) * S);

    if (prog > 0.14) {
        ctx.fillStyle = 'rgba(160,210,255,.52)';
        [{ x: GL.wX1 - 2, y: 14 }, { x: GL.wX1 - 2, y: 26 }, { x: GL.wX1 - 2, y: 38 }, { x: GL.wX2 + 1, y: 18 }, { x: GL.wX2 + 1, y: 32 }, { x: GL.wX2 + 1, y: 44 }]
            .forEach(({ x, y }) => {
                if ((y - GL.wY1) / (GL.wY2 - GL.wY1) < prog) ctx.fillRect(x * S, y * S, S, 2 * S);
            });
    }

    if (prog >= 1) {
        const sparks = [{ x: 5, y: 2, c: '#FFD60A' }, { x: 33, y: 2, c: '#FF85A1' }, { x: 3, y: 28, c: '#4ECDC4' }, { x: 36, y: 22, c: '#FFD60A' }, { x: 9, y: 55, c: '#FF85A1' }, { x: 31, y: 55, c: '#4ECDC4' }];
        sparks.forEach(({ x, y, c }) => {
            if (Math.sin(t * 0.05 + x + y) > 0) {
                r(ctx, x, y, 2, 2, c); p(ctx, x + 1, y - 1, c); p(ctx, x + 1, y + 2, c); p(ctx, x - 1, y + 1, c); p(ctx, x + 3, y + 1, c);
            }
        });
    }
}

export function meltStatus(p) {
    if (p === 0) return ' THE ICE IS PERFECTLY FROZEN...';
    if (p < 0.10) return ' IT\'S STARTING TO MELT — FOCUS!';
    if (p < 0.25) return ' EDGES ARE DRIPPING... KEEP GOING!';
    if (p < 0.40) return ' CRACKS FORMING — YOU\'RE ON FIRE!';
    if (p < 0.55) return ' HALFWAY! THE ICE IS WEAKENING!';
    if (p < 0.70) return ' MELTING FAST — ALMOST THERE!';
    if (p < 0.85) return ' SO CLOSE! DON\'T STOP NOW!';
    if (p < 0.96) return ' LAST STRETCH — PUSH THROUGH!';
    return '✨ JUST A LITTLE MORE...!';
}
