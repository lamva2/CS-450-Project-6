#version 330 compatibility

uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting
uniform float   uShininess;		// specular exponent

in  vec2  vST;			// texture coords
in  vec3  vN;			// normal vector
in  vec3  vL;			// vector from point to light
in  vec3  vE;			// vector from point to eye

const float EYES = 0.90;					// S location of one of the salmon's eyes
const float EYET = 0.65;					// T location of one of the salmon's eyes
const float R 			= 0.03;				// radius of salmon eye
const vec3 SALMONCOLOR		= vec3( 0.98, 0.50, 0.45 );	// "salmon" (r,g,b) color
const vec3 EYECOLOR		= vec3( 0., 1., 0. );		// color to make the eye
const vec3 SPECULARCOLOR 	= vec3( 1., 1., 1. );

void
main( )
{
	vec3 myColor = SALMONCOLOR;
	float ds = abs(EYES - vST.s);					// s distance from current frag to salmon eye
	float dt = abs(EYET - vST.t);					// t distance from current frag to salmon eye
	// If the current frag is within the distance from the salmon eye
	if( ds < 0.03 && dt < 0.03)
	{
			myColor = EYECOLOR;
	}

	// now do the per-fragment lighting:

	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 ambient = uKa * myColor;

	float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * d * myColor;

	float s = 0.;
	if( d > 0. )	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		float cosphi = dot( Eye, ref );
		if( cosphi > 0. )
			s = pow( max( cosphi, 0. ), uShininess );
	}
	vec3 specular = uKs * s * SPECULARCOLOR.rgb;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}