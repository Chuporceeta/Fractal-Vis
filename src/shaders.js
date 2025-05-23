export const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

export const fsSource = `
    precision highp float;
    uniform vec2 uDims, uPanOffset, uZoomOffset, c;
    uniform float R, uZoom;

    vec4 color(float mu) {
        vec4 cols[5];
        cols[0] = vec4(0.0, 0.05, 0.15, 1.0);
        cols[1] = vec4(0.1, 0.5, 0.8, 1.0);
        cols[2] = vec4(0.9, 1.0, 0.9, 1.0);
        cols[3] = vec4(1.0, 0.6, 0.0, 1.0);
        cols[4] = vec4(0.1, 0.1, 0.1, 1.0);

        float x = mod(mu, 50.0) / 10.0;
        vec4 col1, col2;
        if (x < 1.0) {
            col1 = cols[0];
            col2 = cols[1];
        } else if (x < 2.0) {
            col1 = cols[1];
            col2 = cols[2];
        } else if (x < 3.0) {
            col1 = cols[2];
            col2 = cols[3];
        } else {
            col1 = cols[3];
            col2 = cols[4];
        }

        return mix(col1, col2, fract(x));
    }

    // https://github.com/Rachmanin0xFF/GLSL-Color-Functions/blob/main/color-functions.glsl
    const vec3 D65_WHITE = vec3(0.95045592705, 1.0, 1.08905775076);
    vec3 WHITE = D65_WHITE;
    const mat3 XYZ_TO_RGB_M = mat3(
        3.2406255, -1.5372080, -0.4986286,
        -0.9689307, 1.8757561, 0.0415175,
        0.0557101, -0.2040211, 1.0569959
    );
    const mat3 XYZ50_TO_XYZ_M = mat3(
        0.9554734527042182, -0.023098536874261423, 0.0632593086610217,
        -0.028369706963208136, 1.0099954580058226, 0.021041398966943008,
        0.012314001688319899, -0.020507696433477912, 1.3303659366080753
    );
    vec3 LCH_TO_LAB(vec3 LCh) {
        return vec3(
            LCh.x,
            LCh.y * cos(LCh.z * 0.01745329251),
            LCh.y * sin(LCh.z * 0.01745329251)
        );
    }
    float LAB_TO_XYZ_F(float x) {
        //                                     3*(6/29)^2         4/29
        return (x > 0.206897) ? x * x * x : (0.12841854934 * (x - 0.137931034));
    }
    vec3 LAB_TO_XYZ(vec3 Lab) {
        float w = (Lab.x + 16.0) / 116.0;
        return WHITE * vec3(
            LAB_TO_XYZ_F(w + Lab.y / 500.0),
            LAB_TO_XYZ_F(w),
            LAB_TO_XYZ_F(w - Lab.z / 200.0)
        );
    }
    vec3 XYZ_TO_RGB(vec3 xyz) {
        return WHITE == D65_WHITE ? (xyz * XYZ_TO_RGB_M) : ((xyz * XYZ50_TO_XYZ_M) * XYZ_TO_RGB_M);
    }
    float COMPAND_RGB(float a) {
        return (a <= 0.0031308) ? (12.92 * a) : (1.055 * pow(a, 0.41666666666) - 0.055);
    }
    vec3 RGB_TO_SRGB(vec3 rgb) {
        return vec3(COMPAND_RGB(rgb.x), COMPAND_RGB(rgb.y), COMPAND_RGB(rgb.z));
    }

    vec3 XYZ_TO_SRGB(vec3 xyz)  { return RGB_TO_SRGB(XYZ_TO_RGB(xyz));  }
    vec3 LAB_TO_SRGB(vec3 lab)  { return XYZ_TO_RGB(LAB_TO_XYZ(lab));  }
    vec3 LCH_TO_SRGB(vec3 lch)  { return LAB_TO_SRGB(LCH_TO_LAB(lch));  }

    void main() {
        vec2 z = ((gl_FragCoord.xy - uPanOffset) / uDims * 4.0 - 2.0) * max(uDims.x, uDims.y) / uDims.yx / uZoom + uZoomOffset;

        float maxIter = 1000.0, paletteSize = 50.0;
        vec4 col = vec4(0.0, 0.0, 0.0, 1.0);
        for (float iter=0.0; iter < 1000.0; iter++) {
            if (z.x*z.x + z.y*z.y >= R*R) {

                float s = pow(iter / maxIter, 1.0);
                float v = 1.0 - pow(cos(3.14159265359 * s), 2.0);
                vec3 LCH = vec3(
                    75.0 - 75.0 * v,
                    103.0 - 75.0 * v,
                    mod(pow(360.0 * s, 1.5), 360.0)
                );
                col = vec4(LCH_TO_SRGB(LCH), 1.0);

                col = color(iter + 1.0 - log(log(z.x*z.x + z.y*z.y)) / log(2.0));
                break;
            }

            float xtemp = z.x*z.x - z.y*z.y;
            z.y = 2.0 * z.x * z.y + c.y;
            z.x = xtemp + c.x;
        }

        gl_FragColor = col;
    }
`;