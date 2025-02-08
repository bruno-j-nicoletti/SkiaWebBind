.PHONY : release
release :
	if [ ! -d build ] ; then mkdir build; fi
	make skia
	emcmake cmake -GNinja -B build .
	cd build; ninja

.PHONY : skia
skia :
	./build-skia.py --pthread --shallow --config=Release

.PHONE: clean
clean:
	rm -rf build

.PHONE: clean
