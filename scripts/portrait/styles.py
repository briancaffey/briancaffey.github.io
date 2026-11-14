"""The style catalogue for the contact-page Portrait Lab.

Each entry is (slug, name, category, medium). `medium` is dropped into the
prompt after "... as ", so it starts lowercase and describes BOTH the medium
and how the man's face is rendered in it -- without that second half the model
hands back a lightly retouched photograph.
"""

# Leads every prompt. The medium has to win over the photograph.
LEAD = (
    "Completely redraw this entire photograph -- the man, his white wired earphones, "
    "the cracked Liberty Bell and the background behind them -- as "
)

# Closes every prompt. Pins the subject and the bell, frees the background.
KEEP = (
    " Every part of the image must be rendered in this medium, with nothing left looking "
    "photographic. Keep the composition and camera angle: his head and shoulders fill the "
    "right side and the cracked Liberty Bell hangs on the left, both clearly recognisable, "
    "and he is smiling faintly at the camera. The background behind them may be reimagined "
    "to suit the medium."
)

STYLES = [
    # ---------------- confectionery ----------------
    ("cotton-candy", "Cotton Candy", "Confectionery",
     "a sculpture spun entirely from cotton candy, his whole head and the bell built from dense tufts of pink and blue candy floss with thousands of visible sugar strands and fuzzy translucent edges, no skin and no metal anywhere, on a stick at a fairground"),
    ("bubblegum", "Bubblegum", "Confectionery",
     "chewed bubblegum, glossy opaque pink, his face moulded from stretched gum with a half-blown bubble and sticky strands pulling between surfaces"),
    ("gummy", "Gummy Sweets", "Confectionery",
     "giant translucent gummy sweets, his entire head and the bell cast as glossy jelly in red and green that light shines right through, the surface smooth and rubbery and crusted with sugar crystals, lit from behind so they glow"),
    ("hard-candy", "Hard Candy", "Confectionery",
     "swirled hard candy, glassy striped sugar in red and white spirals, every surface polished and reflecting tiny highlights"),
    ("chocolate", "Chocolate", "Confectionery",
     "moulded tempered chocolate, his face a glossy dark chocolate bust with one snapped edge showing the matte break, dusted with cocoa"),
    ("marzipan", "Marzipan", "Confectionery",
     "hand-modelled marzipan, matte almond paste in soft pastels with visible thumbprints and a dusting of icing sugar"),
    ("gingerbread", "Gingerbread", "Confectionery",
     "decorated gingerbread, his face a baked biscuit piped with white royal icing outlines, silver ball bearings for eyes, the bell cut from the same dough"),
    ("rock-candy", "Rock Candy Geode", "Confectionery",
     "a rock candy geode cracked open, a cavity of jagged violet and teal sugar crystals where his face should be, the outer crust dull and grey"),
    ("licorice", "Licorice Allsorts", "Confectionery",
     "licorice allsorts, built from stacked slabs of black licorice and brightly coloured coconut fondant in neat geometric layers"),
    ("macaron", "Macarons", "Confectionery",
     "French macarons, his face assembled from pastel shells with ruffled feet and ganache squeezing out between them"),
    ("buttercream", "Buttercream Cake", "Confectionery",
     "a piped buttercream celebration cake, his hair rendered in swirled star-tip rosettes, hundreds and thousands scattered across a palette-knifed background"),
    ("candy-apple", "Toffee Apple", "Confectionery",
     "a glazed toffee apple, everything dipped in a hard glossy red candy shell with thick drips pooling at the base"),

    # ---------------- food ----------------
    ("fruit-carving", "Fruit Carving", "Food",
     "a carved fruit sculpture, his face cut from watermelon flesh and honeydew with visible knife facets, pips, pith and running juice"),
    ("sushi", "Sushi", "Food",
     "sushi, his face laid from slices of salmon and tuna over pressed vinegared rice, nori seaweed for hair, roe and wasabi picking out the details"),
    ("pizza", "Pizza", "Food",
     "a pizza, his features arranged from melted mozzarella, pepperoni discs and basil leaves on tomato sauce, with a blistered charred crust"),
    ("cheese", "Cheese", "Food",
     "a carved wheel of aged cheese, crumbling rind, irregular holes and a waxy yellow sheen"),
    ("bread", "Bread Dough", "Food",
     "shaped and proved bread dough, his face a glazed loaf with scored slashes that have burst open, flour dusting the crust"),
    ("aspic", "Jelly Mould", "Food",
     "a wobbling jelly mould, everything suspended in quivering translucent aspic with fruit pieces set inside, turned out onto a plate"),
    ("latte-art", "Latte Art", "Food",
     "latte art seen from above, his face poured in steamed milk foam across dark espresso crema inside a white cup"),
    ("arcimboldo", "Vegetable Portrait", "Food",
     "an Arcimboldo vegetable portrait, his features built from peppers, aubergines, garlic bulbs and corn cobs with realistic skins and stalks"),
    ("ice-cream", "Melting Sundae", "Food",
     "a melting ice cream sundae, his head a scooped dome sliding off a waffle cone, sauce running, whipped cream and a glacé cherry"),
    ("cereal", "Breakfast Cereal", "Food",
     "a bowl of breakfast cereal shot from directly above, his face formed from coloured cereal loops floating in milk"),

    # ---------------- natural materials ----------------
    ("carved-wood", "Carved Wood", "Natural material",
     "a hand-carved wooden figure, flat chisel facets across his face, open grain and knots running through, warm oiled oak"),
    ("driftwood", "Driftwood", "Natural material",
     "weathered driftwood lashed together with twine, silver-grey bleached timber split by salt cracks"),
    ("marble", "Marble", "Natural material",
     "carved white marble, polished planes and visible drill marks, grey veining running across his cheek, one chipped edge"),
    ("jade", "Jade", "Natural material",
     "carved jade, deep translucent green stone with cloudy inclusions, polished to a high shine, light glowing through the thinner passages"),
    ("amber", "Amber", "Natural material",
     "fossil amber, everything suspended inside one golden resin block with tiny trapped insects and strings of bubbles"),
    ("scrimshaw", "Scrimshaw", "Natural material",
     "scrimshaw, fine black ink lines scratched into polished ivory-coloured bone that has yellowed with age"),
    ("coral", "Coral Reef", "Natural material",
     "a living coral reef, his face encrusted with brain coral and branching staghorn, anemones waving, small fish passing, dappled underwater light"),
    ("moss", "Moss and Lichen", "Natural material",
     "moss and lichen, every surface furred with damp green growth, pale crustose patches and tiny ferns rooted in the crevices"),
    ("fungus", "Fungi", "Natural material",
     "clustered fungi, his face formed from overlapping bracket mushrooms and pale toadstools with visible gills, spores drifting in the light"),
    ("bark", "Tree Bark", "Natural material",
     "rough tree bark, deeply fissured into plates with sap runs and small beetles, his features emerging from the living trunk"),
    ("feathers", "Feathers", "Natural material",
     "layered bird feathers, iridescent plumage tiling every surface, quills visible where they overlap, soft down at the edges"),
    ("butterfly", "Butterfly Wings", "Natural material",
     "butterfly wings, his face tiled from overlapping iridescent wing scales in blues and oranges, fine powder dust catching the light"),
]

STYLES += [
    # ---------------- synthetic materials ----------------
    ("blown-glass", "Blown Glass", "Synthetic material",
     "hand-blown glass, a hollow translucent vessel in amber and cobalt with trapped bubbles and a rough pontil mark, light refracting through the walls"),
    ("neon", "Neon Tubes", "Synthetic material",
     "bent neon tubing on a dark panel, his face traced in glowing pink and cyan glass with visible electrodes, mounting clips and trailing cables"),
    ("papier-mache", "Papier-Mâché", "Synthetic material",
     "papier-mâché built from pasted newspaper strips with the print still legible under lumpy flat poster paint"),
    ("balloons", "Balloon Animals", "Synthetic material",
     "twisted balloon animals, everything made of squeaky inflated latex in primary colours with knotted joints and hard specular highlights"),
    ("bubble-wrap", "Bubble Wrap", "Synthetic material",
     "bubble wrap, his face pressed into a sheet of plastic bubbles with several already popped flat, crinkled and semi-transparent"),
    ("duct-tape", "Duct Tape", "Synthetic material",
     "silver duct tape, built from overlapping torn strips with frayed fibre edges and wrinkles catching the light"),
    ("lite-brite", "Lite-Brite", "Synthetic material",
     "a Lite-Brite peg board, his face made from glowing coloured plastic pegs pushed through a black grid, each peg a separate point of light"),
    ("chrome", "Liquid Chrome", "Synthetic material",
     "liquid chrome, a flowing mirror-polished metal surface reflecting a distorted sky, with drips merging into fat blobs"),
    ("holographic", "Holographic Foil", "Synthetic material",
     "crinkled holographic foil, iridescent sheeting splitting the light into rainbow bands along every crease"),
    ("cork", "Cork", "Synthetic material",
     "cork, a warm spongy brown surface of compressed granules with a slightly crumbling cut edge"),
    ("raku", "Raku Pottery", "Synthetic material",
     "raku-fired ceramic, crackle glaze over metallic copper lustre with smoke-blackened unglazed patches and fine crazing"),
    ("concrete", "Brutalist Concrete", "Synthetic material",
     "board-formed concrete, grey and pitted with timber grain pressed into it, tie-rod holes and dark water staining"),
    ("lego", "LEGO Bricks", "Synthetic material",
     "a scene rebuilt in LEGO, him a minifigure with a printed face and claw hands, the bell assembled from grey bricks, everything glossy moulded ABS with visible studs"),
    ("plasticine", "Claymation", "Synthetic material",
     "a stop-motion plasticine set, his head modelled in clay with visible thumbprints and seams, small glossy beads for eyes"),

    # ---------------- dark and strange ----------------
    ("devil", "Devil", "Dark",
     "a grinning devil with red skin, curling black horns, slit yellow eyes and a forked beard, lit from below by hellfire while the bell glows at welding heat"),
    ("gargoyle", "Gargoyle", "Dark",
     "a weathered stone gargoyle on a cathedral parapet, mouth open mid-snarl, wings folded, streaked with rain and moss"),
    ("vampire", "Vampire", "Dark",
     "a gothic vampire with bloodless grey skin, red eyes and long fangs above a high black collar, candlelit in a decaying drawing room"),
    ("zombie", "Zombie", "Dark",
     "a decaying zombie with grey mottled flesh, exposed sinew, milky eyes and torn clothing under sickly green light"),
    ("eldritch", "Cosmic Horror", "Dark",
     "an eldritch cosmic horror, extra eyes opening across his skin, writhing tentacles where his collar was, impossible geometry folding behind him"),
    ("calavera", "Sugar Skull", "Dark",
     "a Día de Muertos calavera, his face painted as an ornate sugar skull with marigolds, rhinestones and fine scrollwork"),
    ("daguerreotype", "Haunted Daguerreotype", "Dark",
     "a damaged Victorian daguerreotype, tarnished silver plate with chemical blooms at the edges and a second translucent face bleeding through his own"),
    ("witch", "Witchcraft", "Dark",
     "a candlelit witch's portrait, hollow cheeks beneath a wide black hat, moths circling, dripping wax and bundles of dried herbs"),
    ("cursed-painting", "Cursed Portrait", "Dark",
     "a cursed oil portrait in a gilt frame, the varnish blistering and the paint weeping downward in long runs, his eyes following the viewer"),
    ("creature-fx", "Creature Feature", "Dark",
     "an eighties practical-effects monster suit, latex prosthetics with visible seams, animatronic eyes and dripping slime under hard coloured gels"),
    ("shadow-puppet", "Shadow Puppets", "Dark",
     "a backlit shadow puppet theatre, flat black articulated cut-outs joined with pins against a glowing amber screen"),
    ("krampus", "Krampus", "Dark",
     "Krampus, shaggy black fur, a long red tongue, rusted bells and birch switches, deep snow falling at night"),
    ("wicker", "Wicker Man", "Dark",
     "a towering wicker effigy, woven willow withies lashed into a hollow figure against a burning orange sky"),
    ("voodoo", "Stitched Doll", "Dark",
     "a stitched cloth doll, button eyes, coarse hessian skin with visible seams and loose threads, straw poking out at the joints"),
]

STYLES += [
    # ---------------- art movements ----------------
    ("cubist", "Cubism", "Art movement",
     "an analytic cubist painting, his face shattered into overlapping angular planes seen from several viewpoints at once, in browns and greys"),
    ("surrealist", "Surrealism", "Art movement",
     "a Dalí-esque surrealist oil painting, his face melting and propped on a wooden crutch, long shadows across an empty desert plain"),
    ("art-nouveau", "Art Nouveau", "Art movement",
     "an Art Nouveau panel, his face ringed by a halo of whiplash floral linework in gold leaf, flat decorative colour and a stylised border"),
    ("bauhaus", "Bauhaus", "Art movement",
     "a Bauhaus composition, his face reduced to primary-coloured circles, triangles and bars locked to a strict grid with heavy black rules"),
    ("pointillist", "Pointillism", "Art movement",
     "a pointillist canvas, the whole image built from separate dots of pure unmixed colour that only blend at a distance"),
    ("fauvist", "Fauvism", "Art movement",
     "a Fauvist painting, wild non-naturalistic colour with a green face and orange shadows, thick confident brushstrokes and no modelling"),
    ("baroque", "Baroque", "Art movement",
     "a Caravaggio-style baroque oil, a single hard light raking across his face out of near-total blackness, deep chiaroscuro and rich glazes"),
    ("constructivist", "Constructivist Poster", "Art movement",
     "a Soviet constructivist poster, harsh diagonal composition in red, black and cream with photomontage edges and bold slab lettering shapes"),
    ("mondrian", "De Stijl", "Art movement",
     "a Mondrian composition, his face abstracted into rectangles of flat red, yellow and blue separated by thick black lines on white"),
    ("futurist", "Futurism", "Art movement",
     "an Italian futurist painting, his head repeated in overlapping motion-blurred phases as if moving, with radiating force lines"),
    ("expressionist", "Expressionism", "Art movement",
     "a German expressionist woodblock painting, violently distorted features, acid colour and jagged angular strokes full of anxiety"),
    ("rococo", "Rococo", "Art movement",
     "a Rococo oil, powdered pastel palette, frothy ornament, gilded curling frame elements and a soft diffused boudoir light"),
    ("ukiyo-e", "Ukiyo-e", "Art movement",
     "a Japanese ukiyo-e woodblock print, his face reduced to a few flat black brush outlines over unshaded cream skin, the bell a block of indigo, woodgrain and washi fibres across the sheet"),
    ("impressionist", "Impressionism", "Art movement",
     "a French Impressionist oil sketch, his face dissolving into short dabs of complementary colour with no hard edges anywhere"),

    # ---------------- print and illustration ----------------
    ("comic", "Comic Book", "Print",
     "a vintage comic book panel on newsprint, thick black brush-ink outlines and bold spot blacks, skin a flat colour broken by large Ben-Day dots, plates slightly off-register"),
    ("manga", "Manga", "Print",
     "a black and white manga page, fine screentone dots for shading, dramatic speed lines and heavy inked hair with white highlights"),
    ("newsprint", "Newsprint Halftone", "Print",
     "a coarse newspaper halftone, the whole image resolved into black dots of varying size on yellowed absorbent paper"),
    ("woodcut", "Woodcut", "Print",
     "a black and white woodcut relief print, his face carved entirely from bold parallel gouge marks and cross-hatching with no grey tones"),
    ("linocut", "Linocut", "Print",
     "a two-colour reduction linocut, chunky carved shapes with visible tool chatter and slightly misaligned registration"),
    ("risograph", "Risograph", "Print",
     "a risograph print in two spot inks, fluorescent pink and blue overlapping where they meet, with grainy coverage and visible misregistration"),
    ("zine", "Photocopied Zine", "Print",
     "a third-generation photocopied punk zine, blown-out contrast, toner streaks, scissor-cut edges and a crooked staple"),
    ("picture-book", "Children's Book", "Print",
     "a mid-century children's picture book illustration, flat gouache shapes with grainy texture overlays and a limited four-colour palette"),
    ("botanical", "Botanical Plate", "Print",
     "a Victorian botanical plate, precise engraved outlines filled with delicate hand-tinted watercolour, with a specimen label and foxed paper"),
    ("blueprint", "Blueprint", "Print",
     "a cyanotype blueprint, white technical linework on deep Prussian blue with dimension arrows, a title block and a faint drafting grid"),
    ("tattoo-flash", "Tattoo Flash", "Print",
     "an American traditional tattoo flash sheet, heavy black outlines, a limited palette of red, green and gold, and a banner scroll"),
    ("storyboard", "Storyboard", "Print",
     "a rough production storyboard in grey marker and blue pencil on layout paper, with arrows for camera moves and handwritten frame numbers"),
]

STYLES += [
    # ---------------- digital and retro tech ----------------
    ("pixel-art", "Pixel Art", "Digital",
     "sixteen-bit pixel art on a strict grid of large square pixels, a tight indexed palette and hand-placed dithering in the gradients"),
    ("ascii", "ASCII Terminal", "Digital",
     "green phosphor ASCII art, the whole image built from monospaced letters and punctuation glowing on a black terminal, with scanline bloom"),
    ("crt", "CRT Monitor", "Digital",
     "a convex CRT monitor display, visible aperture-grille stripes, bright scanlines, phosphor bloom and colour fringing at the edges"),
    ("vaporwave", "Vaporwave", "Digital",
     "a vaporwave composition, magenta and cyan gradients, a chrome grid horizon, Roman bust motifs and stray Japanese katakana"),
    ("datamosh", "Datamosh", "Digital",
     "a datamoshed video frame, smeared macroblocks, channel separation and compression artefacts dragging his features sideways"),
    ("wireframe", "Wireframe", "Digital",
     "a glowing green wireframe model on black, every surface reduced to its polygon edges with hidden lines removed"),
    ("low-poly", "Low Poly", "Digital",
     "a faceted low-polygon render, every form reduced to flat triangular facets with hard shading edges and no smooth curves, in muted pastels"),
    ("voxel", "Voxel World", "Digital",
     "a voxel world built entirely from identical cubes, him and the bell blocked out at low resolution with simple flat per-face shading"),
    ("vector-arcade", "Vector Arcade", "Digital",
     "a 1980s vector arcade screen, bright monochrome lines drawn by an electron beam on black with glowing overdrawn corners"),
    ("thermal", "Thermal Camera", "Digital",
     "a thermal camera image, an infrared palette running from cold purple through red and orange to white hot, with a temperature scale bar"),
    ("xray", "X-Ray", "Digital",
     "a medical x-ray, bones and the bell's metal bright against translucent soft tissue on a dark radiographic film"),
    ("hologram", "Hologram", "Digital",
     "a flickering cyan hologram projected into a dark room, built from stacked scan planes with glitching horizontal bands and volumetric glow"),
    ("ps1", "PlayStation 1", "Digital",
     "an early PlayStation era 3D render, low polygon counts, warping affine textures, heavy vertex jitter and dense fog in the distance"),
    ("oscilloscope", "Oscilloscope", "Digital",
     "a green oscilloscope trace, a single continuous glowing line drawing the whole scene on a graticule grid with phosphor persistence"),

    # ---------------- textile and craft ----------------
    ("embroidery", "Embroidery", "Craft",
     "an embroidered patch on felt, stitched in coloured thread with visible satin-stitch direction and a thick merrowed border"),
    ("cross-stitch", "Cross Stitch", "Craft",
     "counted cross stitch on aida cloth, every detail reduced to individual X stitches on a visible square weave, with the canvas showing between them"),
    ("knitted", "Knitting", "Craft",
     "a chunky knitted jumper pattern, his face worked in intarsia across rows of visible knit stitches with a cable border"),
    ("quilt", "Patchwork Quilt", "Craft",
     "a patchwork quilt, his face pieced from printed cotton scraps with visible seam allowances and hand-quilted stitching lines"),
    ("felt", "Needle Felt", "Craft",
     "a needle-felted wool sculpture, soft fuzzy surfaces with fibres standing proud and slightly imprecise hand-formed shapes"),
    ("tapestry", "Medieval Tapestry", "Craft",
     "a medieval woven tapestry, flattened perspective, millefleur background, faded dyes and a coarse visible warp and weft"),
    ("beadwork", "Beadwork", "Craft",
     "glass seed beadwork, the image built from thousands of tiny strung beads on a loom, each one catching a separate highlight"),
    ("latch-hook", "Latch Hook Rug", "Craft",
     "a latch hook rug, short cut lengths of acrylic yarn knotted into a mesh backing, giving a chunky pile with soft colour boundaries"),
    ("lace", "Bobbin Lace", "Craft",
     "bobbin lace, his face described entirely by fine white thread worked into an openwork pattern with the dark background showing through"),
    ("friendship-bracelet", "Friendship Bracelet", "Craft",
     "knotted embroidery floss in a friendship bracelet, chevron and diamond patterns in bright threads with fringed ends"),
]

STYLES += [
    # ---------------- elements ----------------
    ("fire", "Made of Fire", "Elemental",
     "living flame, his head and the bell formed entirely from licking orange and blue fire with sparks rising and smoke curling off the edges"),
    ("water", "Made of Water", "Elemental",
     "clear water in motion, every form a splash caught mid-air with droplets, surface tension and refraction bending what lies behind"),
    ("smoke", "Made of Smoke", "Elemental",
     "drifting smoke, his face resolving out of grey curling tendrils that dissipate at the edges, lit by a single beam"),
    ("lightning", "Made of Lightning", "Elemental",
     "crackling plasma, his features drawn by branching arcs of white-violet electricity against a storm-black sky"),
    ("clouds", "Made of Clouds", "Elemental",
     "towering cumulus cloud, his face sculpted from sunlit vapour with soft shadowed undersides against a clear blue sky"),
    ("lava", "Made of Lava", "Elemental",
     "molten lava, glowing orange cracks running through a cooling black basalt crust, heat shimmer rising from every surface"),
    ("ice", "Ice Sculpture", "Elemental",
     "a chainsaw-carved ice sculpture, cloudy frozen cores and polished translucent faces, meltwater running and chisel marks catching cold blue light"),
    ("sand", "Sand Sculpture", "Elemental",
     "a packed sand sculpture on a beach, crumbling granular edges, carved detail already softening, dry trickles running down"),

    # ---------------- cosmic and sci-fi ----------------
    ("nebula", "Nebula", "Cosmic",
     "a deep-space nebula, his face formed from glowing clouds of ionised hydrogen and dust with stars burning through from behind"),
    ("alien", "Alien", "Cosmic",
     "a grey alien, oversized black almond eyes, smooth hairless skin and a tiny mouth, under cold clinical light"),
    ("cyberpunk", "Cyberpunk", "Cosmic",
     "a rain-slick cyberpunk night street, his face lit from below by magenta and cyan signage, chrome implants at his temple, wet reflections everywhere"),
    ("steampunk", "Steampunk", "Cosmic",
     "a steampunk contraption of brass and riveted copper, exposed clockwork gears turning where his cheek was, leather straps and hissing steam"),
    ("biomech", "Biomechanical", "Cosmic",
     "a Giger-esque biomechanical fusion, ribbed chitinous tubing and polished bone merging with machined metal in airbrushed monochrome"),
    ("mech", "Mecha", "Cosmic",
     "a hard-surface mecha, painted armour panels with panel lines, weathering and decals, servo joints and a glowing visor where his eyes were"),
    ("astronaut", "Astronaut", "Cosmic",
     "an astronaut in a pressure suit, his face behind a gold-tinted visor reflecting the scene, with tether hoses and mission patches"),
    ("kaiju", "Kaiju", "Cosmic",
     "a rubber-suit kaiju rampaging through a miniature city, textured hide, glowing dorsal plates and a toppling model skyline"),

    # ---------------- historical ----------------
    ("egyptian", "Egyptian Tomb", "Historical",
     "an Egyptian tomb wall painting, strict profile composition, flat ochre and lapis pigment on cracked plaster with carved hieroglyph bands"),
    ("greek-vase", "Greek Vase", "Historical",
     "red-figure Greek pottery, orange figures reserved against glossy black slip on a curved vase with meander borders and chipped glaze"),
    ("illuminated", "Illuminated Manuscript", "Historical",
     "an illuminated manuscript page, gold leaf haloes, flattened perspective, a decorated initial and marginalia of odd little beasts on vellum"),
    ("byzantine", "Byzantine Icon", "Historical",
     "a Byzantine mosaic icon, thousands of irregular gold and coloured glass tesserae set at angles so the gold catches the light unevenly"),
    ("persian", "Persian Miniature", "Historical",
     "a Persian miniature painting, jewel-bright flat colour, fine brushwork, stacked perspective and an ornamental floral border"),
    ("chinese-ink", "Ink Wash", "Historical",
     "a Chinese ink wash painting, confident wet brushstrokes in diluted black ink on absorbent paper with large areas left empty, and a red seal"),
    ("lubok", "Russian Lubok", "Historical",
     "a Russian lubok woodblock broadside, naive bold outlines, flat hand-applied colour that strays past the lines, and a decorative caption band"),
    ("bayeux", "Bayeux Tapestry", "Historical",
     "the Bayeux Tapestry, wool crewel embroidery on coarse linen in eight muted colours, with flat outlined figures and a narrow patterned border"),

    # ---------------- scale and illusion ----------------
    ("tilt-shift", "Miniature Diorama", "Illusion",
     "a tilt-shift miniature diorama, model-railway scenery, static grass and hand-painted figures with a narrow band of focus"),
    ("matchstick", "Matchstick Model", "Illusion",
     "a matchstick model, thousands of glued spent matches with red tips arranged to form every surface, on a dusty hobby table"),
    ("chalk", "Pavement Chalk", "Illusion",
     "an anamorphic pavement chalk drawing on wet paving slabs, smudged pastel dust, with the stones' texture breaking up every line"),
    ("origami", "Origami", "Illusion",
     "folded origami paper, every form reduced to creased flat planes with visible fold lines and slight paper curl at the corners"),
    ("topiary", "Topiary", "Illusion",
     "clipped topiary, his head a dense box hedge trimmed to shape with fresh cut leaves and a wire frame just visible beneath"),
    ("pin-art", "Pin Art", "Illusion",
     "a pin art impression toy, thousands of chrome pins pushed forward to form his face in relief, each pin head a tiny highlight"),
]

STYLES += [
    # ---------------- crossovers: two ideas that should not meet ----------------
    ("candy-devil", "Candy Floss Devil", "Crossover",
     "a devil spun entirely from cotton candy, pink sugar horns, a candy-floss beard and glowing boiled-sweet eyes, over a fairground at dusk"),
    ("lego-baroque", "LEGO Old Master", "Crossover",
     "a Caravaggio oil painting whose subject is a LEGO minifigure, dramatic chiaroscuro and cracked varnish rendering glossy moulded plastic"),
    ("sushi-cyberpunk", "Neon Sushi", "Crossover",
     "a neon-drenched cyberpunk alley where he and the bell are built from sushi, raw fish lit by magenta signage, wasabi steam and wet reflections"),
    ("stained-glass-zombie", "Stained Glass Zombie", "Crossover",
     "a cathedral stained-glass window depicting a decaying zombie, rotting flesh rendered in sickly green and grey glass panes set in black lead"),
    ("gingerbread-gothic", "Gingerbread Cathedral", "Crossover",
     "a gothic cathedral baked from gingerbread, flying buttresses piped in royal icing, his face a biscuit relief in a sugar-glass rose window"),
    ("neon-origami", "Neon Origami", "Crossover",
     "folded paper whose every crease is lined with glowing neon tubing, sharp planes in darkness lit only along their folds"),
    ("fruit-renaissance", "Fruit Renaissance", "Crossover",
     "a Renaissance oil portrait of a man composed entirely of fruit, grapes for curls and a pear for a cheek, in smooth old-master glazes"),
    ("bubblewrap-mondrian", "Bubble Wrap De Stijl", "Crossover",
     "a Mondrian grid printed on bubble wrap, flat primary rectangles distorted by the plastic bubbles, several popped and wrinkled flat"),
    ("lava-glass", "Molten Glass", "Crossover",
     "glass at the moment of blowing, still glowing orange and sagging under its own weight, with cooler transparent passages at the rim"),
    ("knitted-horror", "Knitted Cosmic Horror", "Crossover",
     "a cosy knitted jumper pattern depicting an eldritch horror, extra eyes and tentacles worked in soft pastel intarsia across visible stitches"),
    ("chrome-ukiyoe", "Chrome Ukiyo-e", "Crossover",
     "a Japanese woodblock print of a liquid chrome figure, flat key-block outlines around mirror-polished metal reflecting a flat indigo wave"),
    ("balloon-gargoyle", "Balloon Gargoyle", "Crossover",
     "a snarling cathedral gargoyle twisted from squeaky party balloons, latex horns and knotted joints perched on a grey stone ledge"),
    ("pixel-baroque", "Pixel Old Master", "Crossover",
     "a baroque chiaroscuro portrait rendered in low-resolution pixel art, dramatic single-source lighting dithered across a tight indexed palette"),
    ("moss-mecha", "Overgrown Mecha", "Crossover",
     "an abandoned war mecha reclaimed by nature, moss and ferns rooted in its armour panels, rust bleeding down the servo joints"),
    ("jelly-noir", "Aspic Noir", "Crossover",
     "a hard-boiled film noir scene in which everything is set in quivering aspic, venetian-blind shadows refracting through the jelly"),
    ("embroidered-glitch", "Embroidered Glitch", "Crossover",
     "a datamoshed video frame rendered as machine embroidery, smeared macroblocks stitched in dense coloured thread with loose ends hanging"),
    ("cheese-cathedral", "Cheese Byzantium", "Crossover",
     "a Byzantine gold mosaic icon whose tesserae are all cut from different cheeses, rinds and holes forming the halo"),
    ("ice-neon", "Frozen Neon", "Crossover",
     "neon tubing frozen inside a block of cloudy ice, the coloured glow diffusing through frost and meltwater running down the face of the block"),
]

# Fail fast on a duplicate slug or name -- both are used as keys downstream.
_slugs = [s[0] for s in STYLES]
_names = [s[1] for s in STYLES]
assert len(_slugs) == len(set(_slugs)), f"duplicate slug: {[s for s in _slugs if _slugs.count(s) > 1]}"
assert len(_names) == len(set(_names)), f"duplicate name: {[n for n in _names if _names.count(n) > 1]}"


def prompt_for(medium: str) -> str:
    """Joins the three parts into one well-formed paragraph.

    The medium fragments are written without trailing punctuation so they can be
    reused in the caption, so the sentence break is added here.
    """
    body = medium.rstrip()
    if not body.endswith((".", "!", "?")):
        body += "."
    return f"{LEAD}{body}{KEEP}"
