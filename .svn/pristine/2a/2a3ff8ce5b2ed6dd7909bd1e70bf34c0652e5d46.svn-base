var ZK = 
{
    extend : function()
    {
	    // inline overrides  
	    var io = function(o)
	    {
		    for ( var m in o)
		    {
			    this[m] = o[m];
		    }
	    };
	    var oc = Object.prototype.constructor;

	    return function(sb, sp, overrides)
	    {
		    if (typeof sp == 'object')
		    {
			    overrides = sp;
			    sp = sb;
			    sb = overrides.constructor != oc ? overrides.constructor : function()
			    {
				    sp.apply(this, arguments);
			    };
		    }
		    var F = function()
		    {
		    }, sbp, spp = sp.prototype;
		    F.prototype = spp;
		    sbp = sb.prototype = new F();
		    sbp.constructor = sb;
		    sb.superclass = spp;
		    if (spp.constructor == oc)
		    {
			    spp.constructor = sp;
		    }
		    sb.override = function(o)
		    {
			    ZK.override(sb, o);
		    };
		    sbp.override = io;
		    ZK.override(sb, overrides);
		    sb.extend = function(o)
		    {
			    ZK.extend(sb, o);
		    };
		    return sb;
	    };
    }(),

    override : function(origclass, overrides)
    {
	    if (overrides)
	    {
		    var p = origclass.prototype;
		    for ( var method in overrides)
		    {
			    p[method] = overrides[method];
		    }
	    }
    },

    apply : function(o, c, defaults)
    {
	    if (defaults)
	    {
		    // no "this" reference for friendly out of scope calls  
		    ZK.apply(o, defaults);
	    }
	    if (o && c && typeof c == 'object')
	    {
		    for ( var p in c)
		    {
			    o[p] = c[p];
		    }
	    }
	    return o;
    }
};