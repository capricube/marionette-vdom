require('./setup/init');

describe('Marionette.ItemView', function() {
  'use strict';

  beforeEach(function() {
    this.modelData      = {foo: 'bar'};
    this.collectionData = [{foo: 'bar'}, {foo: 'baz'}];
    this.model      = new Backbone.Model(this.modelData);
    this.collection = new Backbone.Collection(this.collectionData);

    this.template = 'foobar';
    this.templateStub = this.sinon.stub().returns(this.template);
  });

  describe('when rendering without a valid template', function() {
    beforeEach(function() {
      this.view = new VDOMItemView();
    });

    it('should throw an exception because there was no valid template', function() {
      expect(this.view.render).to.throw('Cannot render the template since it is null or undefined.');
    });
  });

  describe('when rendering with a false template', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.stub();
      this.onRenderStub       = this.sinon.stub();

      this.View = VDOMItemView.extend({
        template: false,
        onBeforeRender: this.onBeforeRenderStub,
        onRender: this.onRenderStub
      });

      this.view = new this.View();

      this.marionetteRendererSpy   = this.sinon.spy(Marionette.Renderer, 'render');
      this.triggerSpy              = this.sinon.spy(this.view, 'trigger');
      this.serializeDataSpy        = this.sinon.spy(this.view, 'serializeData');
      this.mixinTemplateHelpersSpy = this.sinon.spy(this.view, 'mixinTemplateHelpers');
      this.attachElContentSpy      = this.sinon.spy(this.view, 'attachElContent');

      this.view.render();
    });

    it('should not throw an exception for a false template', function() {
      expect(this.view.render).to.not.throw('Cannot render the template since it is null or undefined.');
    });

    it('should call an "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.view);
    });

    it('should not add in data or template helpers', function() {
      expect(this.serializeDataSpy).to.not.have.been.called;
      expect(this.mixinTemplateHelpersSpy).to.not.have.been.called;
    });

    it('should not render a template', function() {
      expect(this.marionetteRendererSpy).to.not.have.been.called;
    });

    it('should not attach any html content', function() {
      expect(this.attachElContentSpy).to.not.have.been.called;
    });
  });

  describe('when rendering with a overridden attachElContent', function() {
    beforeEach(function() {
      this.attachElContentStub = this.sinon.stub();

      this.ItemView = VDOMItemView.extend({
        template        : this.templateStub,
        attachElContent : this.attachElContentStub
      });
      this.sinon.spy(Marionette.Renderer, 'render');

      this.itemView = new this.ItemView();
      this.itemView.render();
    });

    it('should render according to the custom attachElContent logic', function() {
      expect(this.attachElContentStub).to.have.been.calledOnce.and.calledWith(this.template);
    });

    it("should pass template stub, data and view instance to `Marionette.Renderer.Render`", function(){
      expect(Marionette.Renderer.render).to.have.been.calledWith(this.templateStub, {}, this.itemView);
    });
  });

  describe('when rendering', function() {
    beforeEach(function() {
      this.onBeforeRenderStub = this.sinon.stub();
      this.onRenderStub       = this.sinon.stub();

      this.View = VDOMItemView.extend({
        template       : this.templateStub,
        onBeforeRender : this.onBeforeRenderStub,
        onRender       : this.onRenderStub
      });

      this.view = new this.View();
      this.triggerSpy = this.sinon.spy(this.view, 'trigger');
      this.view.render();
    });

    it('should call a "onBeforeRender" method on the view', function() {
      expect(this.onBeforeRenderStub).to.have.been.calledOnce;
    });

    it('should call an "onRender" method on the view', function() {
      expect(this.onRenderStub).to.have.been.calledOnce;
    });

    it('should trigger a before:render event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('before:render', this.view);
    });

    it('should trigger a rendered event', function() {
      expect(this.triggerSpy).to.have.been.calledWith('render', this.view);
    });
  });

  describe('when an item view has a model and is rendered', function() {
    beforeEach(function() {
      this.view = new VDOMItemView({
        template : this.templateStub,
        model    : this.model
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(this.templateStub).to.have.been.calledWith(this.modelData);
    });
  });

  describe('when an item view has a collection and is rendered', function() {
    beforeEach(function() {
      this.view = new VDOMItemView({
        template   : this.templateStub,
        collection : this.collection
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the collection', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized collection', function() {
      expect(this.templateStub).to.have.been.calledWith({items: this.collectionData});
    });
  });

  describe('when an item view has a model and collection, and is rendered', function() {
    beforeEach(function() {
      this.view = new VDOMItemView({
        template   : this.templateStub,
        model      : this.model,
        collection : this.collection
      });

      this.serializeDataSpy = this.sinon.spy(this.view, 'serializeData');
      this.view.render();
    });

    it('should serialize the model', function() {
      expect(this.serializeDataSpy).to.have.been.calledOnce;
    });

    it('should render the template with the serialized model', function() {
      expect(this.templateStub).to.have.been.calledWith(this.modelData);
    });
  });

  describe('when destroying an item view', function() {
    beforeEach(function() {
      this.onBeforeDestroyStub = this.sinon.stub();
      this.onDestroyStub       = this.sinon.stub();

      this.View = VDOMItemView.extend({
        template        : this.templateStub,
        onBeforeDestroy : this.onBeforeDestroyStub,
        onDestroy       : this.onDestroyStub
      });

      this.view = new this.View();
      this.view.render();

      this.removeSpy        = this.sinon.spy(this.view, 'remove');
      this.stopListeningSpy = this.sinon.spy(this.view, 'stopListening');
      this.triggerSpy       = this.sinon.spy(this.view, 'trigger');

      this.sinon.spy(this.view, 'destroy');
      this.view.destroy();
    });

    it('should remove the views EL from the DOM', function() {
      expect(this.removeSpy).to.have.been.calledOnce;
    });

    it('should unbind any listener to custom view events', function() {
      expect(this.stopListeningSpy).to.have.been.calledOnce;
    });

    it('should trigger "before:destroy"', function(){
      expect(this.triggerSpy).to.have.been.calledWith('before:destroy');
    });

    it('should trigger "destroy"', function(){
      expect(this.triggerSpy).to.have.been.calledWith('destroy');
    });

    it('should call "onBeforeDestroy" if provided', function() {
      expect(this.onBeforeDestroyStub).to.have.been.called;
    });

    it('should call "onDestroy" if provided', function() {
      expect(this.onDestroyStub).to.have.been.called;
    });

    it('should return the view', function() {
      expect(this.view.destroy).to.have.returned(this.view);
    });
  });

  describe('when re-rendering an ItemView that is already shown', function() {
    beforeEach(function() {
      this.onDomRefreshStub = this.sinon.stub();

      this.View = VDOMItemView.extend({
        template     : this.templateStub,
        onDomRefresh : this.onDomRefreshStub
      });

      this.view = new this.View();
      this.setFixtures(this.view.$el);

      this.view.render();
      this.view.triggerMethod('show');
      this.view.render();
    });

    it('should trigger a dom:refresh event', function() {
      expect(this.onDomRefreshStub).to.have.been.calledTwice;
    });
  });

  describe('has a valid inheritance chain back to Marionette.View', function() {
    beforeEach(function() {
      this.constructorSpy = this.sinon.spy(Marionette, 'View');
      this.itemView = new VDOMItemView();
    });

    it('calls the parent Marionette.Views constructor function on instantiation', function() {
      expect(this.constructorSpy).to.have.been.called;
    });
  });

  describe("when serializing view data", function(){
    beforeEach(function(){
      this.modelData = { foo: "bar" };
      this.collectionData = [ { foo: "bar" }, { foo: "baz" } ];

      this.itemView = new VDOMItemView();
      this.sinon.spy(this.itemView, "serializeModel");
      this.sinon.spy(this.itemView, "serializeCollection");
    });

    it("should return an empty object without data", function(){
      expect(this.itemView.serializeData()).to.deep.equal({ });
    });

    describe('and the view has a model', function() {
      beforeEach(function() {
        this.itemView.model = new Backbone.Model(this.modelData);
        this.itemView.serializeData();
      });

      it("should call serializeModel", function() {
        expect(this.itemView.serializeModel).to.have.been.calledOnce;
      });

      it('should not call serializeCollection', function() {
        expect(this.itemView.serializeCollection).to.not.have.been.called;
      });
    });

    describe('and the view only has a collection', function() {
      beforeEach(function() {
        this.itemView.collection = new Backbone.Collection(this.collectionData);
        this.itemView.serializeData(1, 2, 3);
      });

      it("should call serializeCollection", function(){
        expect(this.itemView.serializeCollection).to.have.been.calledOnce;
      });

      it('and the serialize function should be called with the provided arguments', function() {
        expect(this.itemView.serializeCollection).to.have.been.calledWith(this.itemView.collection, 1, 2, 3);
      });

      it("should not call serializeModel", function() {
        expect(this.itemView.serializeModel).to.not.have.been.called;
      });
    });

    describe('and the view has a collection and a model', function() {
      beforeEach(function() {
        this.itemView.model = new Backbone.Model(this.modelData);
        this.itemView.collection = new Backbone.Collection(this.collectionData);
        this.itemView.serializeData(1, 2, 3);
      });

      it("should call serializeModel", function() {
        expect(this.itemView.serializeModel).to.have.been.calledOnce;
      });

      it('and the serialize function should be called with the provided arguments', function() {
        expect(this.itemView.serializeModel).to.have.been.calledWith(this.itemView.model, 1, 2, 3);
      });

      it('should not call serializeCollection', function() {
        expect(this.itemView.serializeCollection).to.not.have.been.called;
      });
    });
  });

  describe("when serializing a collection", function(){
    beforeEach(function(){
      this.collectionData = [ { foo: "bar" }, { foo: "baz" } ];
      this.itemView = new VDOMItemView({
        collection: new Backbone.Collection(this.collectionData)
      });
    });

    it("should serialize to an items attribute", function(){
      expect(this.itemView.serializeData().items).to.be.defined;
    });

    it("should serialize all models", function(){
      expect(this.itemView.serializeData().items).to.deep.equal(this.collectionData);
    });
  });

  describe("has a valid inheritance chain back to Marionette.View", function(){
    beforeEach(function(){
      this.constructor = this.sinon.spy(Marionette, "View");
      this.collectionView = new VDOMItemView();
    });

    it("calls the parent Marionette.View's constructor function on instantiation", function(){
      expect(this.constructor).to.have.been.calledOnce;
    });
  });
});
